from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.chat_message import ChatMessage
from app.models.user import User
from app.schemas.chat import ChatMessageCreate, ChatMessageRead
from app.services.chat_service import ChatService

router = APIRouter(prefix="/repositories", tags=["chat"])


@router.get("/{repository_id}/chat", response_model=list[ChatMessageRead])
def list_chat_messages(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ChatMessage]:
    return ChatService(db, current_user.id).list_messages(repository_id)


@router.post("/{repository_id}/chat", response_model=ChatMessageRead, status_code=status.HTTP_201_CREATED)
def send_chat_message(
    repository_id: int,
    request: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChatMessage:
    return ChatService(db, current_user.id).send_message(repository_id, request.content)