from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RepositoryImportRequest(BaseModel):
    github_url: str


class HealthScoreCheck(BaseModel):
    name: str
    passed: bool
    weight: int
    detail: str


class HealthScoreResponse(BaseModel):
    id: int
    score: float
    breakdown: list[HealthScoreCheck]


class RepositoryCreate(BaseModel):
    user_id: int
    owner: str
    name: str
    github_url: str
    description: str | None = None
    primary_language: str | None = None
    stars: int = 0
    forks: int = 0
    default_branch: str = "main"
    health_score: float | None = None


class RepositoryRead(RepositoryCreate):
    id: int
    imported_at: datetime

    model_config = ConfigDict(from_attributes=True)
