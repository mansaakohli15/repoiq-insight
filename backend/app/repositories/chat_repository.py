from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage


class ChatRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list_by_repository_id(self, repository_id: int) -> list[ChatMessage]:
        statement = (
            select(ChatMessage)
            .where(ChatMessage.repository_id == repository_id)
            .order_by(ChatMessage.created_at.asc())
        )
        return list(self.session.scalars(statement))

    def create(self, message: ChatMessage) -> ChatMessage:
        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)
        return message