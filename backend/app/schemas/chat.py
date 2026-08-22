from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChatMessageCreate(BaseModel):
    content: str


class ChatMessageRead(BaseModel):
    id: int
    repository_id: int
    role: str
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)