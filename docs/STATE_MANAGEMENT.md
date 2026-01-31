# State Management Explanation

## Rule: Server state vs client state

- **TanStack React Query** → All server state (todos, auth user data from API).
- **Zustand** → UI and client-only state (theme, todo filter, in-memory auth token).
- **LocalStorage** → Persistence only (auth session, optional todos cache for offline).

## TanStack Query (server state)

- **Todos:** `useTodosQuery()` uses `useInfiniteQuery` with key `['todos', filter]`. Fetches from `GET /api/todos` with `page`, `limit`, `filter`. Data is cached; mutations invalidate or optimistically update the cache.
- **Auth user:** The “current user” is not refetched from an API; it comes from the login/signup response and is stored in Zustand + LocalStorage. So “user” is treated as client state derived from the token/session.
- **Caching:** `staleTime: 60_000` (1 min). Same query key = deduplication. Background refetch on refocus can be disabled via `refetchOnWindowFocus: false` in the app.
- **Optimistic updates:** `useUpdateTodo` and `useDeleteTodo` update the cache in `onMutate` and roll back in `onError`; `onSettled` invalidates to refetch.

## Zustand (client / UI state)

- **useAuthStore:** `token`, `user`, `setAuth`, `clearAuth`, `hydrate`. In-memory only; persistence is done explicitly in `useAuth` and in `main.jsx` (hydrate from LocalStorage).
- **useUIStore:** `theme`, `todoFilter`, `setTheme`, `setTodoFilter`. Persisted with `zustand/middleware/persist` under key `todo_ui` (LocalStorage).

No server state is kept in Zustand; it only holds UI preferences and the current auth token/user for the session.

## LocalStorage

- **Auth:** Key `todo_auth`. Value: `{ token, user }`. Written on login/signup; cleared on logout. Read on app load in `hydrate()`.
- **Todos cache:** Key `todo_todos_cache`. Written after successful `GET /todos` in the query `queryFn`. Used as `initialData` in `useTodosQuery` for offline-style first paint when available.
- **UI:** Handled by Zustand persist (`todo_ui`).

## Data flow summary

1. User opens app → hydrate auth from LocalStorage → token in Zustand → axios interceptor sends Bearer token.
2. Todo list → React Query fetches from API; filter comes from Zustand; list is server state.
3. Create/update/delete todo → mutation runs → optimistic cache update → invalidate → refetch; todo list stays in React Query only.
4. Theme/filter changes → Zustand only; no API calls.
