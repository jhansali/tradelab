from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import _resolve_user_from_token
from app.core.config import settings
from app.core.security import create_token, hash_password, verify_password
from app.db.session import get_session
from app.models import User
from app.schemas.auth import AuthResponse, UserCreate, UserLogin, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


COOKIE_ACCESS = "access_token"
COOKIE_REFRESH = "refresh_token"


def set_token_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        COOKIE_ACCESS,
        access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    response.set_cookie(
        COOKIE_REFRESH,
        refresh_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.refresh_token_expire_minutes * 60,
        path="/",
    )


def clear_token_cookies(response: Response) -> None:
    response.delete_cookie(COOKIE_ACCESS, path="/")
    response.delete_cookie(COOKIE_REFRESH, path="/")


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate, response: Response, session: AsyncSession = Depends(get_session)) -> AuthResponse:
    normalized_email = payload.email.strip().lower()
    existing = await session.scalar(select(User).where(User.email == normalized_email))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user = User(email=normalized_email, hashed_password=hash_password(payload.password), full_name=payload.full_name)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    access = create_token(str(user.id), settings.access_token_expire_minutes)
    refresh = create_token(str(user.id), settings.refresh_token_expire_minutes)
    set_token_cookies(response, access, refresh)
    return AuthResponse(message="Signup successful", user=UserOut.model_validate(user))


@router.post("/signin", response_model=AuthResponse)
async def signin(payload: UserLogin, response: Response, session: AsyncSession = Depends(get_session)) -> AuthResponse:
    normalized_email = payload.email.strip().lower()
    user = await session.scalar(select(User).where(User.email == normalized_email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access = create_token(str(user.id), settings.access_token_expire_minutes)
    refresh = create_token(str(user.id), settings.refresh_token_expire_minutes)
    set_token_cookies(response, access, refresh)
    return AuthResponse(message="Signin successful", user=UserOut.model_validate(user))


@router.post("/refresh", response_model=AuthResponse)
async def refresh_tokens(request: Request, response: Response, session: AsyncSession = Depends(get_session)) -> AuthResponse:
    refresh_token = request.cookies.get(COOKIE_REFRESH)
    user = await _resolve_user_from_token(refresh_token, session)
    access = create_token(str(user.id), settings.access_token_expire_minutes)
    new_refresh = create_token(str(user.id), settings.refresh_token_expire_minutes)
    set_token_cookies(response, access, new_refresh)
    return AuthResponse(message="Tokens refreshed", user=UserOut.model_validate(user))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    clear_token_cookies(response)


@router.get("/me", response_model=UserOut)
async def me(request: Request, session: AsyncSession = Depends(get_session)) -> UserOut:
    token = request.cookies.get(COOKIE_ACCESS)
    user = await _resolve_user_from_token(token, session)
    return UserOut.model_validate(user)
