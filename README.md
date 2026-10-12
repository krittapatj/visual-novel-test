# Visual Novel Builder

Based on the supplied Day 1–4 React/Express project. Features: authentication, project dashboard, scene CRUD, story text, branching choices, and creator preview. TiDB/MySQL schema lives in `db/01_schema.sql`.

## Setup
1. Create an **empty** TiDB database named `visual_novel` (or your preferred name). Select that database and execute `db/01_schema.sql` in order. Do not run the clean-install schema over existing tables.
2. Copy `backend/.env.example` to `backend/.env`, fill in TiDB credentials, CA path, and JWT secret. The existing CA certificate is in `backend/certs`.
3. `cd backend && npm install && npm run dev`
4. In another terminal, copy `frontend/.env.example` to `frontend/.env`, then `cd frontend && npm install && npm run dev`.
5. Open the Vite URL; register, log in, create a project, add scenes, edit story text, add choices, and click Preview.

## Routes
- POST `/api/auth/register`, POST `/api/auth/login`
- GET/POST `/api/projects`
- GET/POST `/api/projects/:projectId/scenes`; GET/PUT/DELETE `.../scenes/:sceneId`
- GET/POST `/api/projects/:projectId/choices`; DELETE `.../choices/:choiceId`

## Notes
- `db/01_schema.sql` is a clean-install schema; `db/02_existing_database_migration.sql` gives cautious guidance for older installations. Back up production data before migration.
- Current preview is authenticated and is **not** public publishing. Characters, uploads, flowchart UI, media effects, export and public reader publishing remain future work.
- Never commit `.env` files. Configure production CORS, rate limiting and authorization before public deployment.
