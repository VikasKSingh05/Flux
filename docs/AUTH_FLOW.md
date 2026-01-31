# Auth Flow Explanation

## Overview

- **Backend:** JWT access token issued on signup/login; validated by auth middleware on protected routes.
- **Frontend:** Token and user stored in Zustand (in-memory) and persisted in LocalStorage for “remember me” and page refresh.

## Backend Flow

1. **Signup / Login**
   - `POST /api/auth/signup` or `POST /api/auth/login` with `{ email, password }`.
   - Passwords are hashed with bcrypt before saving (signup) and compared on login.
   - On success, server returns `{ user: { id, email }, token }` where `token` is a JWT signed with `JWT_SECRET`, default expiry 7 days.

2. **Protected routes**
   - Client sends `Authorization: Bearer <token>` on every request to `/api/todos/*`.
   - `auth` middleware:
     - Reads token from header.
     - Verifies signature and expiry with `JWT_SECRET`.
     - Loads user by `userId` from token and attaches to `req.user`.
   - If token missing/invalid/expired → 401 Unauthorized.

3. **Logout**
   - No server endpoint; logout is client-only: clear token and user from store and LocalStorage.

## Frontend Flow

1. **Login / Signup**
   - User submits form → `authApi.login()` or `authApi.signup()` (Axios).
   - On success: `login(token, user)` from `useAuth()`:
     - Updates Zustand `useAuthStore` (token + user).
     - Persists `{ token, user }` to LocalStorage.
   - Navigate to `/` (or `from` state if redirected from protected route).

2. **Persistent login**
   - On app load, `main.jsx` calls `useAuthStore.getState().hydrate()` before first render.
   - `hydrate()` reads LocalStorage and, if valid data exists, sets token and user in the store.
   - Protected routes then see the token and allow access without redirecting to login.

3. **Sending the token**
   - Axios request interceptor in `api/client.js` uses a getter registered in `App.jsx`: `setAuthTokenGetter(() => useAuthStore.getState().token)`.
   - Every request automatically gets `Authorization: Bearer <token>` when the user is logged in.

4. **401 handling**
   - Axios response interceptor: on 401, dispatches `auth:logout` custom event.
   - App listens for `auth:logout`, clears auth store and LocalStorage, and redirects to `/login` if on a protected page.

5. **Protected routes**
   - `ProtectedRoute` checks `useAuthStore` for token + user.
   - If missing → redirect to `/login` with `state.from` for post-login redirect.

## Security Notes

- Token is stored in LocalStorage (XSS risk if the app is compromised; consider httpOnly cookies for production).
- Passwords never stored in plain text; bcrypt used on backend.
- CORS is configured so only the frontend origin can call the API.
