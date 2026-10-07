# TradeWise AI project guidance

- Purpose: help traders learn, reflect, and build disciplined habits. The planned AI trading coach is educational, not a signal generator.
- Stack: React, TypeScript, and Vite frontend; FastAPI, PostgreSQL, SQLAlchemy, Alembic, and Pydantic settings backend.
- Architecture: a modular monolith. Keep files lean and single-purpose, with clear module boundaries and reusable components.
- Preserve the working responsive UI and support both dark and light themes in every UI change.
- Backend Google OAuth and revocable server-side sessions are implemented; the frontend login UI and AI coaching are not. Preserve per-user data isolation and OAuth/session protections.
- Preserve existing behavior and avoid unrelated rewrites. Make future changes incrementally and run checks appropriate to each change.
