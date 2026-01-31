# API Documentation

Base URL: `http://localhost:5000/api`

## Auth

- **POST /auth/signup** – Body: `{ email, password }`. Returns `{ user, token }`.
- **POST /auth/login** – Body: `{ email, password }`. Returns `{ user, token }`.

## Todos (header: Authorization: Bearer TOKEN)

- **GET /todos** – Query: `page`, `limit`, `filter` (all|active|completed). Returns `{ todos, pagination }`.
- **POST /todos** – Body: `{ title }`. Returns `{ todo }`.
- **GET /todos/:id** – Returns `{ todo }`.
- **PATCH /todos/:id** – Body: `{ title?, completed? }`. Returns `{ todo }`.
- **DELETE /todos/:id** – Returns `{ id }`.

Errors: `{ success: false, error: "message" }`. See backend routes and controllers for validation details.
