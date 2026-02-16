import { motion, AnimatePresence } from 'framer-motion';
import { useTodosQuery, useReorderTodos } from '../hooks/useTodosQuery';
import { useUIStore } from '../store/useUIStore';
import { TodoItem } from './TodoItem';
import { FilterTabs } from './FilterTabs';
import { Loader2 } from 'lucide-react';

export function TodoList() {
  const theme = useUIStore((state) => state.theme);
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
  const reorderTodos = useReorderTodos();

  const handleMove = (fromIndex, direction) => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= todos.length) return;
    const ids = [...todos.map((t) => t._id)];
    [ids[fromIndex], ids[toIndex]] = [ids[toIndex], ids[fromIndex]];
    reorderTodos.mutate(ids);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12 text-zinc-400">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center py-6 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl">
        {error?.response?.data?.error || error?.message || 'Failed to load todos'}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6 flex justify-center">
        <FilterTabs />
      </div>

      {todos.length === 0 ? (
        <motion.div
          key={`empty-${theme}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400">
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
            {filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'active'
                ? 'No active tasks'
                : 'All caught up!'}
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            {filter === 'all' && "Add a task to get started"}
          </p>
        </motion.div>
      ) : (
        <>
          <motion.ul
            key={theme}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="list-none p-0 m-0 space-y-2"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {todos.map((todo, index) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  canMoveUp={index > 0}
                  canMoveDown={index < todos.length - 1}
                  onMoveUp={() => handleMove(index, 'up')}
                  onMoveDown={() => handleMove(index, 'down')}
                  isReordering={reorderTodos.isPending}
                />
              ))}
            </AnimatePresence>
          </motion.ul>

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium disabled:opacity-50"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={14} /> Loading...
                  </span>
                ) : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
