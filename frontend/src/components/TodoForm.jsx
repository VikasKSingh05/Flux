import { useForm } from 'react-hook-form';
import { useCreateTodo } from '../hooks/useTodosQuery';

export function TodoForm() {
  const createTodo = useCreateTodo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { title: '' } });

  const onSubmit = async (data) => {
    try {
      await createTodo.mutateAsync({ title: data.title.trim() });
      reset();
    } catch (e) {
      // Error handled by React Query
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="What needs to be done?"
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-[#0f3460] bg-white dark:bg-[#0f3460] text-gray-900 dark:text-gray-100 text-base focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
        {...register('title', {
          required: 'Title is required',
          maxLength: { value: 500, message: 'Max 500 characters' },
        })}
        aria-invalid={errors.title ? 'true' : 'false'}
      />
      <button
        type="submit"
        className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold border-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={createTodo.isPending}
      >
        {createTodo.isPending ? 'Adding…' : 'Add'}
      </button>
      {errors.title && (
        <span className="block mt-1 text-sm text-red-500" role="alert">
          {errors.title.message}
        </span>
      )}
    </form>
  );
}
