# RepoIQ Insight

RepoIQ is a React frontend with a FastAPI backend foundation for repository analysis workflows.

## Stack

- React and TypeScript
- Vite
- React Router DOM
- React Query
- Axios
- Tailwind CSS

## Getting started

1. Copy `.env.example` to `.env` and set `VITE_API_URL` if needed.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run lint` — lint TypeScript and React source files

## Backend setup

The backend is intentionally infrastructure-only for this milestone. It provides environment-based database configuration, CORS, Alembic scaffolding, and a health endpoint.

```sh
cd backend
python -m venv .venv
# Windows PowerShell: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux
uvicorn app.main:app --reload
```

Open `http://localhost:8000/docs` for the API documentation. `GET /health` returns `{ "status": "ok" }`.

For development, `DATABASE_URL` defaults to SQLite. Set it to a PostgreSQL SQLAlchemy URL, such as `postgresql+psycopg://user:password@localhost/repoiq`, when PostgreSQL is available.

## Project structure

```text
src/
  components/  Reusable UI and feature components
  layouts/     Shared application and authentication layouts
  pages/       Route-level page components
  routes/      React Router route definitions
  services/    API client and external integrations
  hooks/       Reusable React hooks
  utils/       Shared utilities and placeholder data
  types/       Shared TypeScript types
```

```text
backend/
  app/          FastAPI application modules
  migrations/   Alembic migration environment
  requirements.txt
  .env.example
```

The app currently uses placeholder data. `src/services/api.ts` provides the shared Axios client for future backend integration.
