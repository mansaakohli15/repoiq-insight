import time
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.dependencies import get_db
from app.main import app
from app.utils.security import hash_password, verify_password, create_access_token, verify_access_token

# In-memory test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def client():
    return TestClient(app)


def test_password_hashing():
    raw = "MySecretPassword123!"
    hashed = hash_password(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_generation_and_verification():
    user_id = "42"
    token = create_access_token(user_id)
    assert isinstance(token, str)
    subject = verify_access_token(token)
    assert subject == user_id


def test_register_and_login_flow(client: TestClient):
    timestamp = int(time.time() * 1000)
    username = f"testdev_{timestamp}"
    email = f"testdev_{timestamp}@example.com"
    password = "SuperPassword123!"

    # 1. Register
    reg_response = client.post(
        "/auth/register",
        json={"username": username, "email": email, "password": password},
    )
    assert reg_response.status_code == 201
    data = reg_response.json()
    assert data["username"] == username
    assert data["email"] == email
    assert "id" in data

    # 2. Duplicate registration should fail
    dup_response = client.post(
        "/auth/register",
        json={"username": username, "email": email, "password": password},
    )
    assert dup_response.status_code == 409

    # 3. Login with wrong password
    bad_login = client.post(
        "/auth/login",
        json={"email": email, "password": "WrongPassword!"},
    )
    assert bad_login.status_code == 401

    # 4. Login with correct password
    login_response = client.post(
        "/auth/login",
        json={"email": email, "password": password},
    )
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # 5. Access profile
    profile_res = client.get(
        "/auth/profile",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert profile_res.status_code == 200
    profile_data = profile_res.json()
    assert profile_data["email"] == email
    assert profile_data["username"] == username
