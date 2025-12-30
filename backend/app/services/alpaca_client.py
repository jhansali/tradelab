from functools import lru_cache
from typing import Any, Dict, Iterable, List

import httpx

from app.core.config import settings


HEADERS = {
    "APCA-API-KEY-ID": settings.alpaca_key_id,
    "APCA-API-SECRET-KEY": settings.alpaca_secret_key,
}


@lru_cache(maxsize=1)
def get_http_client() -> httpx.AsyncClient:
    return httpx.AsyncClient(timeout=10.0, headers=HEADERS)


async def fetch_assets() -> List[Dict[str, Any]]:
    client = get_http_client()
    url = f"{settings.alpaca_trade_base}/v2/assets"
    params = {"status": "active", "asset_class": "us_equity"}
    resp = await client.get(url, params=params)
    resp.raise_for_status()
    return resp.json()


async def fetch_latest_quotes(symbols: Iterable[str]) -> Dict[str, Any]:
    client = get_http_client()
    symbols_str = ",".join(symbols)
    url = f"{settings.alpaca_data_base}/v2/stocks/quotes/latest"
    params = {"symbols": symbols_str, "feed": "delayed_sip"}
    resp = await client.get(url, params=params)
    resp.raise_for_status()
    return resp.json()


async def fetch_bars(symbol: str, timeframe: str = "1Hour", limit: int = 24, start: str | None = None) -> Dict[str, Any]:
    client = get_http_client()
    url = f"{settings.alpaca_data_base}/v2/stocks/{symbol}/bars"
    params = {"timeframe": timeframe, "limit": limit, "feed": "delayed_sip", "sort": "asc"}
    if start:
        params["start"] = start
    resp = await client.get(url, params=params)
    resp.raise_for_status()
    return resp.json()
