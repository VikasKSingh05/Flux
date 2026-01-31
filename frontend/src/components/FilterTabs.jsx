import { useUIStore } from '../store/useUIStore';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function FilterTabs() {
  const { todoFilter, setTodoFilter } = useUIStore();

  return (
    <div className="flex gap-1 mb-4" role="tablist" aria-label="Filter todos">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          role="tab"
          aria-selected={todoFilter === f.value}
          className={`px-4 py-2 rounded-lg border text-sm cursor-pointer ${
            todoFilter === f.value
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white dark:bg-[#16213e] border-gray-200 dark:border-[#0f3460] text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-[#0f3460]'
          }`}
          onClick={() => setTodoFilter(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
