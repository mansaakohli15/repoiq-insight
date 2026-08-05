from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.repository import Repository
from app.models.user import User
from app.schemas.repository import RepositoryImportRequest, RepositoryRead
from app.services.github_service import GitHubService

router = APIRouter(prefix="/repositories", tags=["repositories"])


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
