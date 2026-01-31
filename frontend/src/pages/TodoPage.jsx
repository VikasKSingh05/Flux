import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import styles from './TodoPage.module.css';

export function TodoPage() {
  return (
    <div className={styles.page}>
      <TodoForm />
      <TodoList />
    </div>
  );
}
