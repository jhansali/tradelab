FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY alembic.ini ./alembic.ini
COPY alembic ./alembic
COPY app ./app
COPY scripts ./scripts

RUN chmod +x ./scripts/entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["./scripts/entrypoint.sh"]
