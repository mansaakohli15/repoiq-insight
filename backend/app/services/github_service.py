import json
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
        try:
            request = Request(
                endpoint,
                headers={
                    "Accept": "application/vnd.github+json",
                    "User-Agent": "RepoIQ/1.0",
                },
            )
            with urlopen(request, timeout=10) as response:
                payload = json.loads(response.read().decode("utf-8"))
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

        return {
            "owner": payload.get("owner", {}).get("login", ""),
            "name": payload.get("name", ""),
            "description": payload.get("description"),
            "language": payload.get("language"),
            "stargazers_count": payload.get("stargazers_count", 0),
            "forks_count": payload.get("forks_count", 0),
            "default_branch": payload.get("default_branch", "main"),
        }