# Full-Stack Todo App
Production-ready Todo application with authentication, persistence, caching, and offline support.

## Tech Stack

- **Frontend:** React (Vite), Axios, TanStack React Query, Zustand, React Hook Form, React Router, LocalStorage, JWT
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, dotenv, CORS, express-validator

## Quick Start

1. **Backend:** `cd backend && npm install && cp .env.example .env` then set `MONGODB_URI` and `JWT_SECRET`. Run `npm run dev`.
2. **Frontend:** `cd frontend && npm install && npm run dev`.
3. Open http://localhost:5173 — sign up or log in, then use the Todo app.

See [docs/SETUP.md](docs/SETUP.md) for full setup.

## Documentation

- [API routes](docs/API.md)
- [Auth flow](docs/AUTH_FLOW.md)
- [State management](docs/STATE_MANAGEMENT.md)
- [Caching & persistence](docs/CACHING_AND_PERSISTENCE.md)
- [Pitfalls & improvements](docs/PITFALLS_AND_IMPROVEMENTS.md)

## Project Structure

- `backend/src/` — server.js, config, models, controllers, routes, middleware, utils
- `frontend/src/` — api, store, hooks, components, pages, utils, main.jsx, App.jsx
