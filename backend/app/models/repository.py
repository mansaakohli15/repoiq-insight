from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.analysis import Analysis
    from app.models.user import User


class Repository(Base):
    __tablename__ = "repositories"
    __table_args__ = (UniqueConstraint("user_id", "owner", "name", name="uq_repositories_user_owner_name"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    owner: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(255))
    github_url: Mapped[str] = mapped_column(String(2048), unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    primary_language: Mapped[str | None] = mapped_column(String(100))
    stars: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    forks: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    default_branch: Mapped[str] = mapped_column(String(255), default="main", server_default="main")
    health_score: Mapped[float | None] = mapped_column()
    imported_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="repositories")
    analyses: Mapped[list["Analysis"]] = relationship(
        back_populates="repository", cascade="all, delete-orphan"
    )
