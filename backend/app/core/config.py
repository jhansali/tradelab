from typing import List, Union

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    cors_origins: Union[str, List[str]] = Field(default_factory=list, alias="CORS_ORIGINS")
    secret_key: str = Field("changeme", alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(30, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_minutes: int = Field(60 * 24 * 7, alias="REFRESH_TOKEN_EXPIRE_MINUTES")
    algorithm: str = Field("HS256", alias="ALGORITHM")
    alpaca_key_id: str = Field("", alias="APCA_API_KEY_ID")
    alpaca_secret_key: str = Field("", alias="APCA_API_SECRET_KEY")
    alpaca_data_base: str = Field("https://data.alpaca.markets", alias="ALPACA_DATA_BASE")
    alpaca_trade_base: str = Field("https://paper-api.alpaca.markets", alias="ALPACA_TRADE_BASE")
    redis_url: str = Field("redis://redis:6379/0", alias="REDIS_URL")

    model_config = SettingsConfigDict(env_file=".env", env_prefix="", extra="ignore")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_origins(cls, value):
        if value is None:
            return []
        if isinstance(value, str):
            if not value.strip():
                return []
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


settings = Settings()
