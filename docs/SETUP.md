# Setup Instructions

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Backend

1. Go to backend: `cd backend`
2. Install: `npm install`
3. Set `backend/.env`:
   - `MONGODB_URI` (e.g. `mongodb://localhost:27017/todo`)
   - `JWT_SECRET` (long random string)
   - Optional: `PORT`, `CORS_ORIGIN`, `JWT_EXPIRES_IN`
4. Start MongoDB if local
5. Run: `npm run dev` (or `npm start` for production)

Server runs at http://localhost:5000 by default.

## Frontend

1. Go to frontend: `cd frontend`
2. Install: `npm install`
3. Optional: copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` (default: http://localhost:5000/api)
4. Run: `npm run dev`
5. Build: `npm run build` (output in `frontend/dist`)

App runs at http://localhost:5173 by default.

## Full stack from repo root

- Terminal 1: `cd backend && npm install && npm run dev`
- Terminal 2: `cd frontend && npm install && npm run dev`
- Open http://localhost:5173 and sign up or log in.
