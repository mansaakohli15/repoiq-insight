from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AnalysisCreate(BaseModel):
    repository_id: int
    summary: str | None = None
    architecture: str | None = None
    tech_stack: str | None = None
    use_cases: str | None = None
    limitations: str | None = None


class AnalysisRead(AnalysisCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
