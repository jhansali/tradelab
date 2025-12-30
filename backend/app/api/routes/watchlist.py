import re
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy import delete, insert, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_user_id_optional
from app.db.session import get_session
from app.models import WatchlistItem

router = APIRouter(prefix="/api/watchlist", tags=["watchlist"])

SYMBOL_RE = re.compile(r"^[A-Z0-9\.]{1,16}$")


async def _symbols_for_user(session: AsyncSession, user_id: int) -> List[str]:
    rows = await session.scalars(
        select(WatchlistItem.symbol).where(WatchlistItem.user_id == user_id).order_by(WatchlistItem.created_at.desc())
    )
    return list(rows)


@router.get("")
async def get_watchlist(session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_optional)) -> dict:
    symbols = await _symbols_for_user(session, user_id)
    return {"symbols": symbols}


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_symbol(
    payload: dict, session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_optional)
) -> dict:
    symbol = payload.get("symbol", "")
    if not isinstance(symbol, str):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid symbol")
    symbol = symbol.strip().upper()
    if not SYMBOL_RE.match(symbol):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Symbol format invalid")

    stmt = insert(WatchlistItem).values(user_id=user_id, symbol=symbol)
    try:
        await session.execute(stmt)
        await session.commit()
    except IntegrityError:
        await session.rollback()
    symbols = await _symbols_for_user(session, user_id)
    return {"symbols": symbols}


@router.delete("/{symbol}")
async def delete_symbol(
    symbol: str = Path(..., description="Symbol to remove"),
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_user_id_optional),
) -> dict:
    await session.execute(delete(WatchlistItem).where(WatchlistItem.user_id == user_id, WatchlistItem.symbol == symbol.upper()))
    await session.commit()
    symbols = await _symbols_for_user(session, user_id)
    return {"symbols": symbols}


@router.delete("")
async def clear_watchlist(session: AsyncSession = Depends(get_session), user_id: int = Depends(get_user_id_optional)) -> dict:
    await session.execute(delete(WatchlistItem).where(WatchlistItem.user_id == user_id))
    await session.commit()
    return {"symbols": []}
