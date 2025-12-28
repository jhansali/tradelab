from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password
from app.db.session import get_session
from app.models import User
from app.schemas.auth import AuthResponse, UserCreate, UserLogin, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate, session: AsyncSession = Depends(get_session)) -> AuthResponse:
    normalized_email = payload.email.strip().lower()
    existing = await session.scalar(select(User).where(User.email == normalized_email))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user = User(email=normalized_email, hashed_password=hash_password(payload.password), full_name=payload.full_name)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return AuthResponse(message="Signup successful", user=UserOut.model_validate(user))


@router.post("/signin", response_model=AuthResponse)
async def signin(payload: UserLogin, session: AsyncSession = Depends(get_session)) -> AuthResponse:
    normalized_email = payload.email.strip().lower()
    user = await session.scalar(select(User).where(User.email == normalized_email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return AuthResponse(message="Signin successful", user=UserOut.model_validate(user))
