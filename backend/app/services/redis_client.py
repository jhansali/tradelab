import json
from functools import lru_cache
from typing import Any, Optional

from redis import asyncio as aioredis

from app.core.config import settings


@lru_cache(maxsize=1)
def get_redis_client() -> aioredis.Redis:
    return aioredis.from_url(settings.redis_url, decode_responses=True)


async def get_json(key: str) -> Optional[Any]:
    client = get_redis_client()
    raw = await client.get(key)
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


async def set_json(key: str, value: Any, ttl_seconds: int) -> None:
    client = get_redis_client()
    await client.set(key, json.dumps(value), ex=ttl_seconds)
