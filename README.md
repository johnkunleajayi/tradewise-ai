# TradeWise AI

A responsive React + TypeScript + Vite frontend with cyan branding and persistent dark/light themes.

## Run locally

Requires Node.js 22.12+ (tested with Node 24).

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Open http://127.0.0.1:5173. Vite prints another port if 5173 is occupied.

```sh
npm run build
npm run lint
npm run preview
```

## Structure

- `src/layout` â€” app shell, navigation and header
- `src/ui` â€” reusable branding and section headings
- `src/features/dashboard` â€” hero, progress, prompt composer and recent drafts
- `src/hooks` â€” persistent theme state
- `src/types` â€” shared frontend types
- `src/styles` â€” theme tokens and focused stylesheets, including responsive rules

## Preview behavior

The theme defaults to the system preference and persists in localStorage. Suggested prompts populate the composer. Submit a prompt or attach a PNG, JPEG or WebP (up to 10 MB) to create a local draft in Recent analysis. Attachment metadata and drafts live only in memory and reset on refresh. Files are never sent anywhere. Streak, XP and level values are labeled demo data.

The FastAPI and PostgreSQL backend in `backend/` supports Google OAuth, user profile creation/updates, and revocable server-side sessions. Frontend login UI, AI integration, and screenshot analysis are not implemented.

## Backend authentication and local PostgreSQL

Keep database and Google credentials in the ignored `backend/.env`; use `backend/.env.example` as the template. Google Cloud must register `http://localhost:8000/api/auth/google/callback` for the same Web application client as the configured ID and secret.

From the project root, start the already-initialized local PostgreSQL instance after a Windows restart:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\backend\scripts\start-postgres.ps1
```

This helper uses the ignored `.runtime/postgresql` installation and persistent data. It does not install PostgreSQL on a fresh clone. The local databases are `tradewise` and the separate disposable `tradewise_test`; both must have migrations applied through `0002_auth_sessions`.

From `backend/`, run the API and checks:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:create_app --factory --host 127.0.0.1 --port 8000 --no-access-log
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m ruff check app tests migrations
```

Open http://localhost:8000/api/auth/google/login to sign in. The callback redirects to `GET /api/auth/me`, which returns the authenticated user. `POST /api/auth/logout` revokes the session and requires a trusted `Origin` header (for example, `http://localhost:8000`). `GET /api/health` checks database connectivity. Cookies are HttpOnly and SameSite=Lax; HTTPS deployments use Secure cookies. OAuth state, nonce, and PKCE validation remain required.

## Built with Codex

Codex is being used to implement, test, and iterate on TradeWise AI through small, focused development tasks.
