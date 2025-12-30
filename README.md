Tradelab monorepo with FastAPI backend and Next.js frontend.

Setup
- cp .env.example .env
- docker compose up --build

URLs
- http://localhost:3000
- http://localhost:8000
- http://localhost:8000/docs
- http://localhost:8000/health

Services
- Postgres, Redis, backend (FastAPI), frontend (Next.js). Market data proxied via backend (Alpaca) with Redis caching.

Auth
- Backend issues JWT cookies for signup/signin; use strong secrets and HTTPS-only cookies for production.
