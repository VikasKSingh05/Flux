/**
 * Single todo: title, completed toggle, delete.
 * Optimistic updates via useUpdateTodo / useDeleteTodo.
 */
import { useUpdateTodo, useDeleteTodo } from '../hooks/useTodosQuery';
import styles from './TodoItem.module.css';

export function TodoItem({ todo }) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const isUpdating = updateTodo.isPending && updateTodo.variables?.id === todo._id;
  const isDeleting = deleteTodo.isPending && deleteTodo.variables === todo._id;

  const handleToggle = () => {
    updateTodo.mutate({ id: todo._id, completed: !todo.completed });
  };

  const handleDelete = () => {
    deleteTodo.mutate(todo._id);
  };

  return (
    <li
      className={`${styles.item} ${todo.completed ? styles.completed : ''}`}
      data-testid="todo-item"
    >
      <input
        type="checkbox"
        checked={!!todo.completed}
        onChange={handleToggle}
        disabled={isUpdating}
        className={styles.checkbox}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span className={styles.title}>{todo.title}</span>
      <button
        type="button"
        className={styles.deleteBtn}
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={`Delete "${todo.title}"`}
      >
        {isDeleting ? '…' : '×'}
      </button>
    </li>
  );
}
