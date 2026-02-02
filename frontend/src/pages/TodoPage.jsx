import { MagnifyingInput } from '../components/MagnifyingInput';
import { TodoList } from '../components/TodoList';
import { useCreateTodo } from '../hooks/useTodosQuery';

export function TodoPage() {
  const createTodo = useCreateTodo();

  return (
    <div className="w-full">
      <div className="mb-12">
        <MagnifyingInput onAdd={(title) => createTodo.mutateAsync({ title })} />
      </div>
      <TodoList />
    </div>
  );
}
