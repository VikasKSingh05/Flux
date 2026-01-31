import { MagnifyingInput } from '../components/MagnifyingInput';
import { TodoList } from '../components/TodoList';
import { useCreateTodo } from '../hooks/useTodosQuery';

export function TodoPage() {
  const createTodo = useCreateTodo();

  const handleAddTodo = async (title) => {
    try {
      await createTodo.mutateAsync({ title });
    } catch (error) {
      console.error("Failed to add todo", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-12">
        <MagnifyingInput onAdd={handleAddTodo} />
      </div>
      <TodoList />
    </div>
  );
}
