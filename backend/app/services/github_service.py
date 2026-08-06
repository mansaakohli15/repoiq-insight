import json
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.repository import Repository
from app.repositories.repository_repository import RepositoryRepository


class GitHubService:
    def __init__(self, session: Session, current_user_id: int) -> None:
        self.session = session
        self.current_user_id = current_user_id
        self.repositories = RepositoryRepository(session)

    def get_repository(self, repository_id: int) -> Repository:
        repository = self.repositories.get_by_user_and_id(self.current_user_id, repository_id)
        if repository is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Repository not found",
            )
        return repository

    def generate_health_score(self, repository_id: int) -> dict[str, object]:
        repository = self.repositories.get_by_user_and_id(self.current_user_id, repository_id)
        if repository is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Repository not found",
            )

        metadata = self._fetch_github_repo(f"https://api.github.com/repos/{repository.owner}/{repository.name}")
        readme_ok = self._github_endpoint_exists(
            f"https://api.github.com/repos/{repository.owner}/{repository.name}/readme"
        )
        licence_ok = metadata.get("license") is not None
        description_ok = bool(metadata.get("description"))
        topics_ok = len(metadata.get("topics", [])) >= 1
        issues_ok = bool(metadata.get("has_issues"))
        wiki_ok = bool(metadata.get("has_wiki"))
        default_branch_ok = str(metadata.get("default_branch", "main")).lower() in {"main", "master"}
        actions_ok = self._github_actions_enabled(repository.owner, repository.name)
        test_ok = self._has_test_indicators(repository.owner, repository.name)
        recent_activity_ok = self._has_recent_commit_activity(repository.owner, repository.name)

        breakdown = [
            {"name": "README", "passed": readme_ok, "weight": 15, "detail": "README present"},
            {"name": "License", "passed": licence_ok, "weight": 10, "detail": "Repository license declared"},
            {"name": "Description", "passed": description_ok, "weight": 10, "detail": "Repository description provided"},
            {"name": "Topics", "passed": topics_ok, "weight": 10, "detail": "Repository topics set"},
            {"name": "Issues enabled", "passed": issues_ok, "weight": 5, "detail": "Issues are enabled"},
            {"name": "Wiki enabled", "passed": wiki_ok, "weight": 5, "detail": "Wiki is enabled"},
            {"name": "Default branch", "passed": default_branch_ok, "weight": 5, "detail": "Default branch set to main/master"},
            {"name": "GitHub Actions", "passed": actions_ok, "weight": 10, "detail": "CI workflows present"},
            {"name": "Tests", "passed": test_ok, "weight": 15, "detail": "Test files or folders detected"},
            {"name": "Recent commit activity", "passed": recent_activity_ok, "weight": 15, "detail": "Recent commits in the last 30 days"},
        ]
        score = round(sum(check["weight"] for check in breakdown if check["passed"]))

        repository.health_score = score
        self.repositories.update(repository)

        return {
            "id": repository.id,
            "score": score,
            "breakdown": breakdown,
        }

    def import_repository(self, github_url: str) -> Repository:
        parsed = self._validate_github_url(github_url)
        owner = parsed["owner"]
        name = parsed["name"]

        existing = self.repositories.get_by_user_owner_name(self.current_user_id, owner, name)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Repository has already been imported",
            )

        import_url = f"https://api.github.com/repos/{owner}/{name}"
        import_result = self._fetch_github_repo(import_url)

        repository = Repository(
            user_id=self.current_user_id,
            owner=import_result["owner"],
            name=import_result["name"],
            description=import_result.get("description"),
            github_url=github_url,
            primary_language=import_result.get("language"),
            stars=import_result.get("stargazers_count", 0),
            forks=import_result.get("forks_count", 0),
            default_branch=import_result.get("default_branch", "main"),
        )

        return self.repositories.create(repository)

    def _validate_github_url(self, github_url: str) -> dict[str, str]:
        parsed = urlparse(github_url)
        if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() != "github.com":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Please provide a valid GitHub repository URL",
            )

        path_parts = [part for part in parsed.path.split("/") if part]
        if len(path_parts) != 2:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Please provide a valid GitHub repository URL",
            )

        owner, name = path_parts[0], path_parts[1]
        return {"owner": owner, "name": name}

    def _fetch_github_repo(self, endpoint: str) -> dict[str, object]:
        payload = self._fetch_github_json(endpoint)
        return {
            "owner": payload.get("owner", {}).get("login", ""),
            "name": payload.get("name", ""),
            "description": payload.get("description"),
            "language": payload.get("language"),
            "stargazers_count": payload.get("stargazers_count", 0),
            "forks_count": payload.get("forks_count", 0),
            "default_branch": payload.get("default_branch", "main"),
            "has_issues": payload.get("has_issues", True),
            "has_wiki": payload.get("has_wiki", True),
            "license": payload.get("license"),
            "topics": payload.get("topics", []),
        }

    def _fetch_github_json(self, endpoint: str) -> dict[str, object] | list[object]:
        try:
            request = Request(
                endpoint,
                headers={
                    "Accept": "application/vnd.github+json",
                    "User-Agent": "RepoIQ/1.0",
                },
            )
            with urlopen(request, timeout=10) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="GitHub repository could not be found",
            ) from error
        except URLError as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to reach the GitHub API",
            ) from error

    def _github_endpoint_exists(self, endpoint: str) -> bool:
        try:
            self._fetch_github_json(endpoint)
            return True
        except HTTPException:
            return False

    def _github_actions_enabled(self, owner: str, name: str) -> bool:
        endpoint = f"https://api.github.com/repos/{owner}/{name}/actions/workflows"
        payload = self._fetch_github_json(endpoint)
        workflows = payload.get("workflows", []) if isinstance(payload, dict) else []
        return len(workflows) > 0

    def _has_test_indicators(self, owner: str, name: str) -> bool:
        endpoint = f"https://api.github.com/repos/{owner}/{name}/contents"
        try:
            payload = self._fetch_github_json(endpoint)
        except HTTPException:
            return False

        if not isinstance(payload, list):
            return False

        names = {item.get("name", "").lower() for item in payload if isinstance(item, dict)}
        test_markers = {"test", "tests", "__tests__", "spec", "specs", "testdata"}
        file_markers = {"pytest.ini", "tox.ini", "jest.config.js", "vitest.config.ts"}
        return bool(names & test_markers or names & file_markers)

    def _has_recent_commit_activity(self, owner: str, name: str) -> bool:
        endpoint = f"https://api.github.com/repos/{owner}/{name}/commits?per_page=5"
        try:
            payload = self._fetch_github_json(endpoint)
        except HTTPException:
            return False

        if not isinstance(payload, list):
            return False

        cutoff = datetime.now(timezone.utc) - timedelta(days=30)
        for commit in payload:
            if not isinstance(commit, dict):
                continue
            commit_date = commit.get("commit", {}).get("author", {}).get("date")
            if not isinstance(commit_date, str):
                continue
            try:
                commit_time = datetime.fromisoformat(commit_date.replace("Z", "+00:00"))
            except ValueError:
                continue
            if commit_time.tzinfo is None:
                commit_time = commit_time.replace(tzinfo=timezone.utc)
            if commit_time >= cutoff:
                return True
        return False