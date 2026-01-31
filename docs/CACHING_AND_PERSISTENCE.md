# Caching & Persistence

## React Query caching

- **Stale time:** 60 seconds. Within that window, the same query key returns cached data without a refetch.
- **Query keys:** Todos use `['todos', filter]` so each filter (all/active/completed) has its own cache.
- **Deduplication:** Multiple components using `useTodosQuery()` with the same filter share one request.
- **Background refetch:** After stale time, next mount or refocus can trigger a refetch (configurable in `QueryClient` defaultOptions).
- **Invalidation:** After create/update/delete todo, `queryClient.invalidateQueries({ queryKey: ['todos'] })` runs so all todo lists refetch.

## Optimistic updates

- **Update todo:** In `onMutate`, the cache is updated with the new `completed` or `title`. If the request fails, `onError` restores the previous cache from `context.prev`. `onSettled` invalidates.
- **Delete todo:** Same pattern: remove the item from the cache in `onMutate`, rollback in `onError`, invalidate in `onSettled`.

So the UI updates immediately; if the server fails, it reverts and refetches.

## LocalStorage persistence

- **Auth:** Stored on login/signup so that after refresh the user stays logged in. Cleared on logout or 401.
- **Todos:** Last successful list response (per filter) is written in the query `queryFn`. `useTodosQuery` can use this as `initialData` so the first paint can show last-known todos (e.g. offline or slow network). It’s a cache snapshot, not the source of truth; the source of truth is the API.

## Offline behavior

- If the app loads offline, auth can still be restored from LocalStorage (token + user), so the user appears logged in.
- Todo list can show `initialData` from LocalStorage if it was saved earlier.
- Mutations (create/update/delete) will fail without network; React Query will retry or show error; optimistic updates can be rolled back.

To improve offline support you could add a service worker and/or a sync queue for mutations when the network is back.
