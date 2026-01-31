# Common Pitfalls & Improvements

## Pitfalls

1. **Token in LocalStorage**  
   Vulnerable to XSS. If an attacker can run JS, they can read the token. For higher security, use httpOnly cookies for the access token (or short-lived access + refresh token in cookie).

2. **CORS**  
   If the frontend runs on a different port or domain, ensure `CORS_ORIGIN` in the backend matches the frontend origin exactly (including protocol and port).

3. **MongoDB connection**  
   If the app crashes on start, check `MONGODB_URI` (typos, wrong host, network, Atlas IP allowlist).

4. **Filter vs query key**  
   Todo list query key includes `filter`. Changing the filter (all/active/completed) triggers a new request; that’s intentional. Don’t mix filter in Zustand with a different filter in the query key.

5. **Optimistic rollback**  
   On mutation error we restore previous cache. Ensure `context.prev` is captured correctly in `onMutate` (all relevant query keys for the todo list).

6. **Hydrate before render**  
   Auth must be hydrated from LocalStorage in `main.jsx` before the first React render so `ProtectedRoute` sees the token and doesn’t redirect to login on refresh.

## Improvements

1. **Refresh token**  
   Use a short-lived access token and a refresh token (in httpOnly cookie or secure storage) to get new access tokens without re-login.

2. **Rate limiting**  
   Add rate limiting on auth and API routes (e.g. express-rate-limit) to prevent brute force and abuse.

3. **Request validation**  
   Backend already uses express-validator; keep validating all inputs and return clear 400 messages.

4. **Error boundaries**  
   Add a React error boundary so React Query errors (or component errors) don’t crash the whole app; show a fallback and optionally a retry.

5. **Offline queue**  
   Queue create/update/delete when offline and sync when back online (e.g. with a library or custom queue + retry).

6. **Tests**  
   Add backend unit/integration tests (auth, todos) and frontend tests (components, hooks) for regression safety.

7. **Logging**  
   In production, log errors and important events (e.g. failed login, 5xx) to a logging service.

8. **HTTPS**  
   Use HTTPS in production for both frontend and backend.
