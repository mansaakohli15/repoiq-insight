from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InterviewQuestion(BaseModel):
    question: str
    difficulty: str
    tag: str


class AnalysisCreate(BaseModel):
    repository_id: int
    summary: str | None = None
    architecture: str | None = None
    tech_stack: str | None = None
    use_cases: str | None = None
    limitations: str | None = None
    readme_markdown: str | None = None


class AnalysisRead(BaseModel):
    id: int
    repository_id: int
    summary: str | None = None
    architecture: str | None = None
    tech_stack: str | None = None
    use_cases: str | None = None
    limitations: str | None = None
    readme_markdown: str | None = None
    interview_questions: list[InterviewQuestion] | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)