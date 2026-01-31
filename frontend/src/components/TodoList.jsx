/**
 * Todo list: filter tabs, list with infinite scroll (load more).
 * Uses useTodosQuery (React Query useInfiniteQuery) with filter from Zustand.
 */
import { useTodosQuery } from '../hooks/useTodosQuery';
import { TodoItem } from './TodoItem';
import { FilterTabs } from './FilterTabs';
import styles from './TodoList.module.css';

export function TodoList() {
  const {
    todos,
    isLoading,
    isError,
    error,
    filter,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTodosQuery();

  if (isLoading) {
    return <div className={styles.message}>Loading todos…</div>;
  }
  if (isError) {
    return (
      <div className={styles.error}>
        {error?.response?.data?.error || error?.message || 'Failed to load todos'}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <FilterTabs />
      {todos.length === 0 ? (
        <p className={styles.empty}>
          {filter === 'completed'
            ? 'No completed todos.'
            : filter === 'active'
              ? 'No active todos.'
              : 'No todos yet. Add one above!'}
        </p>
      ) : (
        <>
          <ul className={styles.list}>
            {todos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </ul>
          {hasNextPage && (
            <button
              type="button"
              className={styles.loadMore}
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Loading…' : 'Load more'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
