import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';

export function TodoPage() {
  return (
    <div className="w-full">
      <TodoForm />
      <TodoList />
    </div>
  );
}
