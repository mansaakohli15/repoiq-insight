from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analysis import Analysis


class AnalysisRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_id(self, analysis_id: int) -> Analysis | None:
        return self.session.get(Analysis, analysis_id)

    def list_by_repository_id(self, repository_id: int) -> list[Analysis]:
        statement = select(Analysis).where(Analysis.repository_id == repository_id)
        return list(self.session.scalars(statement))

    def get_latest_by_repository_id(self, repository_id: int) -> Analysis | None:
        statement = (
            select(Analysis)
            .where(Analysis.repository_id == repository_id)
            .order_by(Analysis.created_at.desc())
        )
        return self.session.scalars(statement).first()

    def create(self, analysis: Analysis) -> Analysis:
        self.session.add(analysis)
        self.session.commit()
        self.session.refresh(analysis)
        return analysis