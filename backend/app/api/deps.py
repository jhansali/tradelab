from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import get_session
from app.models import User

bearer_scheme = HTTPBearer(auto_error=False)

ACCESS_COOKIE_NAME = "access_token"


async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_session),
) -> User:
    token = None
    if creds and creds.scheme.lower() == "bearer":
        token = creds.credentials
    return await _resolve_user_from_token(token, session)


async def get_current_user_from_cookie(
    request: Request, session: AsyncSession = Depends(get_session)
) -> User:
    token = request.cookies.get(ACCESS_COOKIE_NAME)
    return await _resolve_user_from_token(token, session)


async def get_user_id_optional(request: Request, session: AsyncSession = Depends(get_session)) -> int:
    """
    Attempt to read user id from access token cookie; fall back to 1 if not authenticated.
    """
    token = request.cookies.get(ACCESS_COOKIE_NAME)
    try:
        user = await _resolve_user_from_token(token, session)
        return user.id
    except HTTPException:
        return 1


async def _resolve_user_from_token(token: str | None, session: AsyncSession) -> User:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = await session.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
