import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import HTTPException, status
from groq import Groq
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.analysis import Analysis
from app.models.repository import Repository
from app.repositories.analysis_repository import AnalysisRepository
from app.repositories.repository_repository import RepositoryRepository


class AnalysisService:
    def __init__(self, session: Session, current_user_id: int) -> None:
        self.session = session
        self.current_user_id = current_user_id
        self.repositories = RepositoryRepository(session)
        self.analyses = AnalysisRepository(session)
        self._client: Groq | None = None

    def generate_summary(self, repository_id: int) -> Analysis:
        repository = self._get_owned_repository(repository_id)
        readme_text = self._fetch_readme(repository)
        prompt = self._build_prompt(repository, readme_text)
        result = self._call_groq(prompt)

        analysis = Analysis(
            repository_id=repository.id,
            summary=result["summary"],
            architecture=result["architecture"],
            tech_stack=result["tech_stack"],
            use_cases=result["use_cases"],
            limitations=result["limitations"],
        )
        return self.analyses.create(analysis)

    def get_latest_summary(self, repository_id: int) -> Analysis | None:
        repository = self._get_owned_repository(repository_id)
        return self.analyses.get_latest_by_repository_id(repository.id)

    def _get_owned_repository(self, repository_id: int) -> Repository:
        repository = self.repositories.get_by_user_and_id(self.current_user_id, repository_id)
        if repository is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Repository not found",
            )
        return repository

    def _fetch_readme(self, repository: Repository) -> str:
        for branch in (repository.default_branch, "main", "master"):
            url = f"https://raw.githubusercontent.com/{repository.owner}/{repository.name}/{branch}/README.md"
            try:
                request = Request(url, headers={"User-Agent": "RepoIQ/1.0"})
                with urlopen(request, timeout=10) as response:
                    return response.read().decode("utf-8")[:6000]
            except (HTTPError, URLError):
                continue
        return ""

    def _build_prompt(self, repository: Repository, readme_text: str) -> str:
        return (
            f"You are analyzing the GitHub repository {repository.owner}/{repository.name}.\n"
            f"Primary language: {repository.primary_language or 'unknown'}.\n"
            f"Description: {repository.description or 'none provided'}.\n"
            f"README contents (may be truncated):\n{readme_text or 'No README found.'}\n\n"
            "Respond with ONLY a JSON object, no markdown, no code fences, with exactly these keys: "
            "summary, architecture, tech_stack, use_cases, limitations. "
            "Each value must be a concise plain-text paragraph (2-4 sentences). "
            "summary: what the project does and its purpose. "
            "architecture: how the codebase appears to be structured. "
            "tech_stack: languages, frameworks and tools evident from the README and metadata. "
            "use_cases: who would use this and why. "
            "limitations: gaps, missing docs, or things unclear from the available information."
        )

    def _call_groq(self, prompt: str) -> dict[str, str]:
        client = self._get_client()
        try:
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=800,
            )
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to reach the AI summary service",
            ) from error

        content = (completion.choices[0].message.content or "{}").strip()
        if content.startswith("```"):
            content = content.strip("`")
            if content.lower().startswith("json"):
                content = content[4:]

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="AI summary service returned an unexpected response",
            ) from error

        return {
            "summary": str(parsed.get("summary", "")),
            "architecture": str(parsed.get("architecture", "")),
            "tech_stack": str(parsed.get("tech_stack", "")),
            "use_cases": str(parsed.get("use_cases", "")),
            "limitations": str(parsed.get("limitations", "")),
        }

    def _get_client(self) -> Groq:
        if self._client is None:
            settings = get_settings()
            if not settings.groq_api_key:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="AI summary service is not configured",
                )
            self._client = Groq(api_key=settings.groq_api_key)
        return self._client