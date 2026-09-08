from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, engine
from app.models import analysis, chat_message, repository, user  # noqa: F401
from app.routers import auth, chat, health, repository as repo_router

# Auto-create tables on startup if they don't exist
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(repo_router.router)
app.include_router(chat.router)