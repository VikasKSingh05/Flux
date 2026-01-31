/**
 * Create-todo form using React Hook Form.
 */
import { useForm } from 'react-hook-form';
import { useCreateTodo } from '../hooks/useTodosQuery';
import styles from './TodoForm.module.css';

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
      // Error shown via React Query / toast if you add one
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input
        type="text"
        placeholder="What needs to be done?"
        className={styles.input}
        {...register('title', {
          required: 'Title is required',
          maxLength: { value: 500, message: 'Max 500 characters' },
        })}
        aria-invalid={errors.title ? 'true' : 'false'}
      />
      <button type="submit" className={styles.btn} disabled={createTodo.isPending}>
        {createTodo.isPending ? 'Adding…' : 'Add'}
      </button>
      {errors.title && (
        <span className={styles.error} role="alert">
          {errors.title.message}
        </span>
      )}
    </form>
  );
}
