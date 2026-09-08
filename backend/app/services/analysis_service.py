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
from app.schemas.analysis import AnalysisRead, InterviewQuestion


class AnalysisService:
    def __init__(self, session: Session, current_user_id: int) -> None:
        self.session = session
        self.current_user_id = current_user_id
        self.repositories = RepositoryRepository(session)
        self.analyses = AnalysisRepository(session)
        self._client: Groq | None = None

    def generate_summary(self, repository_id: int) -> AnalysisRead:
        repository = self._get_owned_repository(repository_id)
        readme_text = self._fetch_readme(repository)
        prompt = self._build_summary_prompt(repository, readme_text)
        result = self._call_groq_json(prompt)

        analysis = Analysis(
            repository_id=repository.id,
            summary=result["summary"],
            architecture=result["architecture"],
            tech_stack=result["tech_stack"],
            use_cases=result["use_cases"],
            limitations=result["limitations"],
        )
        saved = self.analyses.create(analysis)
        return self._to_read(saved)

    def generate_readme(self, repository_id: int) -> AnalysisRead:
        repository = self._get_owned_repository(repository_id)
        existing_readme = self._fetch_readme(repository)
        latest_analysis = self.analyses.get_latest_by_repository_id(repository.id)

        prompt = self._build_readme_prompt(repository, existing_readme, latest_analysis)
        readme_markdown = self._call_groq_text(prompt)

        analysis = Analysis(
            repository_id=repository.id,
            summary=latest_analysis.summary if latest_analysis else None,
            architecture=latest_analysis.architecture if latest_analysis else None,
            tech_stack=latest_analysis.tech_stack if latest_analysis else None,
            use_cases=latest_analysis.use_cases if latest_analysis else None,
            limitations=latest_analysis.limitations if latest_analysis else None,
            readme_markdown=readme_markdown,
            interview_questions=latest_analysis.interview_questions if latest_analysis else None,
        )
        saved = self.analyses.create(analysis)
        return self._to_read(saved)

    def generate_interview_questions(self, repository_id: int) -> AnalysisRead:
        repository = self._get_owned_repository(repository_id)
        readme_text = self._fetch_readme(repository)
        latest_analysis = self.analyses.get_latest_by_repository_id(repository.id)

        prompt = self._build_interview_prompt(repository, readme_text, latest_analysis)
        questions = self._call_groq_questions(prompt)

        analysis = Analysis(
            repository_id=repository.id,
            summary=latest_analysis.summary if latest_analysis else None,
            architecture=latest_analysis.architecture if latest_analysis else None,
            tech_stack=latest_analysis.tech_stack if latest_analysis else None,
            use_cases=latest_analysis.use_cases if latest_analysis else None,
            limitations=latest_analysis.limitations if latest_analysis else None,
            readme_markdown=latest_analysis.readme_markdown if latest_analysis else None,
            interview_questions=json.dumps(questions),
        )
        saved = self.analyses.create(analysis)
        return self._to_read(saved)

    def get_latest_summary(self, repository_id: int) -> AnalysisRead | None:
        repository = self._get_owned_repository(repository_id)
        latest = self.analyses.get_latest_by_repository_id(repository.id)
        return self._to_read(latest) if latest else None

    def _to_read(self, analysis: Analysis) -> AnalysisRead:
        parsed_questions: list[InterviewQuestion] | None = None
        if analysis.interview_questions:
            try:
                raw = json.loads(analysis.interview_questions)
                parsed_questions = [InterviewQuestion(**q) for q in raw]
            except (json.JSONDecodeError, TypeError, ValueError):
                parsed_questions = None

        return AnalysisRead(
            id=analysis.id,
            repository_id=analysis.repository_id,
            summary=analysis.summary,
            architecture=analysis.architecture,
            tech_stack=analysis.tech_stack,
            use_cases=analysis.use_cases,
            limitations=analysis.limitations,
            readme_markdown=analysis.readme_markdown,
            interview_questions=parsed_questions,
            created_at=analysis.created_at,
        )

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

    def _build_summary_prompt(self, repository: Repository, readme_text: str) -> str:
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

    def _build_readme_prompt(
        self, repository: Repository, existing_readme: str, latest_analysis: Analysis | None
    ) -> str:
        context = ""
        if latest_analysis and latest_analysis.summary:
            context = (
                f"Known summary: {latest_analysis.summary}\n"
                f"Known architecture: {latest_analysis.architecture or ''}\n"
                f"Known tech stack: {latest_analysis.tech_stack or ''}\n"
            )

        return (
            f"Write a professional README.md for the GitHub repository "
            f"{repository.owner}/{repository.name}.\n"
            f"Primary language: {repository.primary_language or 'unknown'}.\n"
            f"Description: {repository.description or 'none provided'}.\n"
            f"{context}"
            f"Existing README content, if any (may be truncated, use as reference "
            f"only, do not copy verbatim):\n{existing_readme or 'None found.'}\n\n"
            "Respond with ONLY the README content in valid Markdown, no code fences around "
            "the whole thing, no commentary before or after. Include: a title, a short "
            "description, a Features section, a Tech Stack section, a Getting Started / "
            "Installation section with generic setup steps, and a Usage section. "
            "Keep it concise and professional."
        )

    def _build_interview_prompt(
        self, repository: Repository, readme_text: str, latest_analysis: Analysis | None
    ) -> str:
        context = ""
        if latest_analysis and latest_analysis.summary:
            context = (
                f"Known summary: {latest_analysis.summary}\n"
                f"Known architecture: {latest_analysis.architecture or ''}\n"
                f"Known tech stack: {latest_analysis.tech_stack or ''}\n"
            )

        return (
            f"You are preparing technical interview questions about the GitHub repository "
            f"{repository.owner}/{repository.name}.\n"
            f"Primary language: {repository.primary_language or 'unknown'}.\n"
            f"{context}"
            f"README contents (may be truncated):\n{readme_text or 'No README found.'}\n\n"
            "Generate exactly 6 interview questions a technical interviewer could reasonably "
            "ask a candidate about THIS specific repository's design and implementation choices. "
            "Mix difficulty levels: 2 easy, 2 medium, 2 hard. "
            "Respond with ONLY a JSON array, no markdown, no code fences, of exactly 6 objects, "
            "each with exactly these keys: question (string), difficulty (one of: Easy, Medium, Hard), "
            "tag (a short 2-4 word topic label, e.g. 'Architecture', 'Data flow', 'Trade-offs')."
        )

    def _call_groq_json(self, prompt: str) -> dict[str, str]:
        content = self._call_groq_raw(prompt)
        content = self._strip_code_fences(content)

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

    def _call_groq_questions(self, prompt: str) -> list[dict[str, str]]:
        content = self._call_groq_raw(prompt)
        content = self._strip_code_fences(content)

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="AI summary service returned an unexpected response",
            ) from error

        if not isinstance(parsed, list):
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="AI summary service returned an unexpected response",
            )

        questions: list[dict[str, str]] = []
        for item in parsed:
            if not isinstance(item, dict):
                continue
            questions.append(
                {
                    "question": str(item.get("question", "")),
                    "difficulty": str(item.get("difficulty", "Medium")),
                    "tag": str(item.get("tag", "General")),
                }
            )
        return questions

    def _call_groq_text(self, prompt: str) -> str:
        content = self._call_groq_raw(prompt)
        return self._strip_code_fences(content)

    def _strip_code_fences(self, content: str) -> str:
        content = content.strip()
        if content.startswith("```"):
            lines = content.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            content = "\n".join(lines)
        return content.strip()

    def _call_groq_raw(self, prompt: str) -> str:
        client = self._get_client()
        settings = get_settings()

        candidate_models = [
            settings.groq_model,
            "llama-3.1-8b-instant",
            "llama3-70b-8192",
            "llama3-8b-8192",
            "mixtral-8x7b-32768",
        ]
        models_to_try = [m for i, m in enumerate(candidate_models) if m and m not in candidate_models[:i]]

        last_error = None
        for model_name in models_to_try:
            try:
                completion = client.chat.completions.create(
                    model=model_name,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=1200,
                )
                return (completion.choices[0].message.content or "").strip()
            except Exception as error:
                last_error = error
                error_str = str(error).lower()
                if "model_not_found" in error_str or "does not exist" in error_str or "404" in error_str:
                    continue
                break

        error_msg = str(last_error) if last_error else "AI summary service unavailable"
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI summary service error: {error_msg}",
        )

    def _get_client(self) -> Groq:
        if self._client is None:
            settings = get_settings()
            if not settings.groq_api_key or not settings.groq_api_key.strip():
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="AI summary service is not configured. Please add GROQ_API_KEY to your Render environment variables.",
                )
            self._client = Groq(api_key=settings.groq_api_key.strip())
        return self._client