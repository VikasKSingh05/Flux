/**
 * Todo list: filter tabs, list with infinite scroll (load more).
 * Uses useTodosQuery (React Query useInfiniteQuery) with filter from Zustand.
 */
import { useTodosQuery } from '../hooks/useTodosQuery';
import { TodoItem } from './TodoItem';
import { FilterTabs } from './FilterTabs';

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
    return (
      <div className="w-full text-center py-6 text-gray-900 dark:text-gray-100">
        Loading todos…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="w-full text-center py-6 text-red-500">
        {error?.response?.data?.error || error?.message || 'Failed to load todos'}
      </div>
    );
  }

  return (
    <div className="w-full">
      <FilterTabs />
      {todos.length === 0 ? (
        <p className="text-center py-6 text-gray-900 dark:text-gray-100">
          {filter === 'completed'
            ? 'No completed todos.'
            : filter === 'active'
              ? 'No active todos.'
              : 'No todos yet. Add one above!'}
        </p>
      ) : (
        <>
          <ul className="list-none p-0 m-0">
            {todos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </ul>
          {hasNextPage && (
            <button
              type="button"
              className="block w-full mt-4 py-3 rounded-lg border border-gray-200 dark:border-[#0f3460] bg-white dark:bg-[#16213e] text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-[#0f3460] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-[0.95rem]"
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
