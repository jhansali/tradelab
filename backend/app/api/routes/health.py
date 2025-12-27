from fastapi import APIRouter
from sqlalchemy import text

from app.db.session import get_engine

router = APIRouter()


@router.get("/health")
async def health() -> dict[str, str]:
    engine = get_engine()
    async with engine.connect() as connection:
        result = await connection.execute(text("SELECT 1"))
        result.scalar_one()
    return {"status": "ok"}
