from datetime import datetime, timedelta, timezone
from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
import httpx

from app.services.alpaca_client import fetch_assets, fetch_bars, fetch_latest_quotes
from app.services.redis_client import get_json, set_json

router = APIRouter(prefix="/api/market", tags=["market"])


def _validate_symbols(symbols_param: str) -> List[str]:
    symbols = [s.strip().upper() for s in symbols_param.split(",") if s.strip()]
    if not symbols:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No symbols provided")
    return symbols


@router.get("/search")
async def search_assets(q: str = Query("", min_length=0)) -> dict:
    q = q.strip()
    cache_key = "alpaca:assets:us_equity_active"
    assets = await get_json(cache_key)
    if assets is None:
        assets = await fetch_assets()
        await set_json(cache_key, assets, ttl_seconds=6 * 60 * 60)

    if not q:
        return {"results": []}

    q_upper = q.upper()
    starts = []
    contains = []
    for asset in assets:
        symbol = asset.get("symbol", "").upper()
        name = asset.get("name") or ""
        if symbol.startswith(q_upper):
            starts.append((symbol, name))
        elif q_upper in symbol:
            contains.append((symbol, name))

    combined = []
    seen = set()
    for sym, name in starts + contains:
        if sym in seen:
            continue
        seen.add(sym)
        combined.append({"symbol": sym, "name": name})
        if len(combined) >= 10:
            break

    return {"results": combined}


@router.get("/quotes")
async def get_quotes(symbols: str = Query(..., description="Comma-separated symbols")) -> dict:
    parsed = _validate_symbols(symbols)
    key = ",".join(sorted(parsed))
    cache_key = f"quotes:delayed_sip:{key}"
    cached = await get_json(cache_key)
    if cached is not None:
        return cached

    data = await fetch_latest_quotes(sorted(parsed))
    now_iso = datetime.now(timezone.utc).isoformat()
    quotes: Dict[str, dict] = {}
    alpaca_quotes = data.get("quotes", {})
    for sym in parsed:
        q = alpaca_quotes.get(sym, {}) or {}
        bid = q.get("bp")
        ask = q.get("ap")
        last = None
        if bid is not None and ask is not None:
            last = round((bid + ask) / 2, 4)
        elif ask is not None:
            last = ask
        elif bid is not None:
            last = bid
        quotes[sym] = {
            "symbol": sym,
            "last": last,
            "bid": bid,
            "ask": ask,
            "changePct": None,
            "updatedAt": q.get("t"),
        }

    payload = {"asOf": now_iso, "quotes": quotes}
    await set_json(cache_key, payload, ttl_seconds=20)
    return payload


@router.get("/chart")
async def get_chart(symbol: str = Query(..., min_length=1)) -> dict:
    symbol = symbol.strip().upper()
    cache_key = f"chart:1Hour:24:delayed_sip:{symbol}"
    cached = await get_json(cache_key)
    if cached is not None:
        return cached

    start = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
    try:
        data = await fetch_bars(symbol, timeframe="1Hour", limit=24, start=start)
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Alpaca error: {detail}") from exc
    bars = data.get("bars", [])
    points = [{"t": bar.get("t"), "c": bar.get("c")} for bar in bars if bar.get("t") is not None and bar.get("c") is not None]
    payload = {"symbol": symbol, "asOf": datetime.now(timezone.utc).isoformat(), "points": points}
    await set_json(cache_key, payload, ttl_seconds=60)
    return payload
