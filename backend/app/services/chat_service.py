from fastapi import HTTPException, status
from groq import Groq
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.chat_message import ChatMessage
from app.models.repository import Repository
from app.repositories.analysis_repository import AnalysisRepository
from app.repositories.chat_repository import ChatRepository
from app.repositories.repository_repository import RepositoryRepository


class ChatService:
    def __init__(self, session: Session, current_user_id: int) -> None:
        self.session = session
        self.current_user_id = current_user_id
        self.repositories = RepositoryRepository(session)
        self.analyses = AnalysisRepository(session)
        self.chats = ChatRepository(session)
        self._client: Groq | None = None

    def list_messages(self, repository_id: int) -> list[ChatMessage]:
        repository = self._get_owned_repository(repository_id)
        return self.chats.list_by_repository_id(repository.id)

    def send_message(self, repository_id: int, content: str) -> ChatMessage:
        repository = self._get_owned_repository(repository_id)

        user_message = ChatMessage(
            repository_id=repository.id,
            role="user",
            content=content,
        )
        self.chats.create(user_message)

        history = self.chats.list_by_repository_id(repository.id)
        reply_text = self._call_groq(repository, history)

        assistant_message = ChatMessage(
            repository_id=repository.id,
            role="assistant",
            content=reply_text,
        )
        return self.chats.create(assistant_message)

    def _get_owned_repository(self, repository_id: int) -> Repository:
        repository = self.repositories.get_by_user_and_id(self.current_user_id, repository_id)
        if repository is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Repository not found",
            )
        return repository

    def _call_groq(self, repository: Repository, history: list[ChatMessage]) -> str:
        latest_analysis = self.analyses.get_latest_by_repository_id(repository.id)

        context_parts = [
            f"You are answering questions about the GitHub repository "
            f"{repository.owner}/{repository.name}.",
        ]
        if latest_analysis:
            if latest_analysis.summary:
                context_parts.append(f"Summary: {latest_analysis.summary}")
            if latest_analysis.architecture:
                context_parts.append(f"Architecture: {latest_analysis.architecture}")
            if latest_analysis.tech_stack:
                context_parts.append(f"Tech stack: {latest_analysis.tech_stack}")
            if latest_analysis.readme_markdown:
                context_parts.append(
                    f"README:\n{latest_analysis.readme_markdown[:3000]}"
                )
        else:
            context_parts.append(
                "No AI analysis has been generated yet for this repository, so answer "
                "using only general knowledge and mention that a fuller analysis isn't "
                "available yet."
            )

        context_parts.append(
            "Answer the user's questions about this repository conversationally and "
            "concisely, based on the information above. If something isn't covered by "
            "the available information, say so honestly rather than guessing."
        )

        system_message = {"role": "system", "content": "\n\n".join(context_parts)}
        conversation = [
            {"role": msg.role, "content": msg.content}
            for msg in history[-10:]
        ]

        client = self._get_client()
        settings = get_settings()

        candidate_models = [
            settings.groq_model,
            "llama-3.1-8b-instant",
            "openai/gpt-oss-20b",
            "openai/gpt-oss-120b",
            "qwen/qwen3-32b",
            "gemma2-9b-it",
        ]
        models_to_try = [m for i, m in enumerate(candidate_models) if m and m not in candidate_models[:i]]

        last_error = None
        for model_name in models_to_try:
            try:
                completion = client.chat.completions.create(
                    model=model_name,
                    messages=[system_message, *conversation],
                    temperature=0.4,
                    max_tokens=600,
                )
                return (completion.choices[0].message.content or "").strip()
            except Exception as error:
                last_error = error
                continue

        error_msg = str(last_error) if last_error else "AI chat service unavailable"
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI chat service error: {error_msg}",
        )

    def _get_client(self) -> Groq:
        if self._client is None:
            settings = get_settings()
            if not settings.groq_api_key or not settings.groq_api_key.strip():
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="AI chat service is not configured. Please add GROQ_API_KEY to your Render environment variables.",
                )
            self._client = Groq(api_key=settings.groq_api_key.strip())
        return self._client