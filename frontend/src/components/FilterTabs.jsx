import { useUIStore } from '../store/useUIStore';
import styles from './FilterTabs.module.css';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function FilterTabs() {
  const { todoFilter, setTodoFilter } = useUIStore();

  return (
    <div className={styles.tabs} role="tablist" aria-label="Filter todos">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          role="tab"
          aria-selected={todoFilter === f.value}
          className={todoFilter === f.value ? styles.active : styles.tab}
          onClick={() => setTodoFilter(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
