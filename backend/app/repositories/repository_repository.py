from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.repository import Repository


class RepositoryRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_id(self, repository_id: int) -> Repository | None:
        return self.session.get(Repository, repository_id)

    def get_by_user_and_id(self, user_id: int, repository_id: int) -> Repository | None:
        statement = select(Repository).where(
            Repository.id == repository_id,
            Repository.user_id == user_id,
        )
        return self.session.scalar(statement)

    def get_by_user_owner_name(self, user_id: int, owner: str, name: str) -> Repository | None:
        statement = select(Repository).where(
            Repository.user_id == user_id,
            Repository.owner == owner,
            Repository.name == name,
        )
        return self.session.scalar(statement)

    def get_by_github_url(self, github_url: str) -> Repository | None:
        statement = select(Repository).where(Repository.github_url == github_url)
        return self.session.scalar(statement)

    def list_by_user_id(self, user_id: int) -> list[Repository]:
        statement = select(Repository).where(Repository.user_id == user_id)
        return list(self.session.scalars(statement))

    def create(self, repository: Repository) -> Repository:
        self.session.add(repository)
        self.session.commit()
        self.session.refresh(repository)
        return repository

    def update(self, repository: Repository) -> Repository:
        self.session.add(repository)
        self.session.commit()
        self.session.refresh(repository)
        return repository
