import { useUIStore } from '../store/useUIStore';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function FilterTabs() {
  const { todoFilter, setTodoFilter } = useUIStore();

  return (
    <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-full" role="tablist" aria-label="Filter todos">
      {FILTERS.map((f) => {
        const isActive = todoFilter === f.value;
        return (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={clsx(
              "relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors z-10",
              isActive
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
            onClick={() => setTodoFilter(f.value)}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-full shadow-sm z-[-1]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
