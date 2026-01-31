/**
 * Single todo: title, completed toggle, delete.
 * Optimistic updates via useUpdateTodo / useDeleteTodo.
 */
import { useUpdateTodo, useDeleteTodo } from '../hooks/useTodosQuery';

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
      className={`flex items-center gap-3 p-3 mb-2 rounded-lg border border-gray-200 dark:border-[#0f3460] bg-white dark:bg-[#16213e] ${todo.completed ? '' : ''}`}
      data-testid="todo-item"
    >
      <input
        type="checkbox"
        checked={!!todo.completed}
        onChange={handleToggle}
        disabled={isUpdating}
        className="w-5 h-5 cursor-pointer accent-blue-500"
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span
        className={`flex-1 break-words ${todo.completed ? 'line-through opacity-70' : ''}`}
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="w-8 h-8 flex items-center justify-center rounded bg-transparent border-0 text-inherit opacity-60 hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 disabled:cursor-not-allowed text-xl cursor-pointer"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={`Delete "${todo.title}"`}
      >
        {isDeleting ? '…' : '×'}
      </button>
    </li>
  );
}
