from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.repository import Repository
from app.models.user import User
from app.schemas.repository import HealthScoreResponse, RepositoryImportRequest, RepositoryRead
from app.services.github_service import GitHubService

router = APIRouter(prefix="/repositories", tags=["repositories"])


@router.get("", response_model=list[RepositoryRead])
def list_repositories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Repository]:
    return GitHubService(db, current_user.id).list_repositories()


@router.post("/import", response_model=RepositoryRead, status_code=status.HTTP_201_CREATED)
def import_repository(
    request: RepositoryImportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Repository:
    return GitHubService(db, current_user.id).import_repository(request.github_url)


@router.get("/{repository_id}", response_model=RepositoryRead)
def get_repository_details(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Repository:
    return GitHubService(db, current_user.id).get_repository(repository_id)


@router.post("/{repository_id}/health-score", response_model=HealthScoreResponse)
def generate_repository_health_score(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, object]:
    return GitHubService(db, current_user.id).generate_health_score(repository_id)