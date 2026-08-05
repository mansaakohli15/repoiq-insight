from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegistrationRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegistrationRequest, db: Session = Depends(get_db)) -> User:
    return AuthService(db).register(request)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    return AuthService(db).login(request)


@router.get("/profile", response_model=UserResponse)
def profile(current_user: User = Depends(get_current_user)) -> User:
    return current_user
