from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegistrationRequest, TokenResponse
from app.utils.security import create_access_token, hash_password, verify_password


class AuthService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.users = UserRepository(session)

    def register(self, request: RegistrationRequest) -> User:
        if self.users.get_by_username(request.username):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already in use")
        if self.users.get_by_email(request.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already in use")

        user = User(
            username=request.username,
            email=request.email,
            password_hash=hash_password(request.password),
        )
        try:
            return self.users.create(user)
        except IntegrityError as error:
            self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username or email is already in use",
            ) from error

    def login(self, request: LoginRequest) -> TokenResponse:
        user = self.users.get_by_email(request.email)
        if user is None or not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return TokenResponse(access_token=create_access_token(str(user.id)))
