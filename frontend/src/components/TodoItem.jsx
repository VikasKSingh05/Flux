import { useUpdateTodo, useDeleteTodo } from '../hooks/useTodosQuery';
import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export function TodoItem({ todo }) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  // We can use generic loading state or specific id check if needed
  const isUpdating = updateTodo.isPending && updateTodo.variables?.id === todo._id;
  const isDeleting = deleteTodo.isPending && deleteTodo.variables === todo._id;

  const handleToggle = () => {
    updateTodo.mutate({ id: todo._id, completed: !todo.completed });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteTodo.mutate(todo._id);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        layout: { type: "spring", stiffness: 300, damping: 30 } // Smoother layout shift
      }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.02)" }}
      className={clsx(
        "group flex items-center gap-4 p-4 mb-3 rounded-2xl bg-white dark:bg-zinc-900 border transition-all",
        todo.completed ? "border-transparent opacity-60" : "border-zinc-100 dark:border-zinc-800 shadow-sm"
      )}
    >
      <button
        onClick={handleToggle}
        disabled={isUpdating}
        className={clsx(
          "relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-colors duration-300 flex items-center justify-center",
          todo.completed
            ? "bg-emerald-500 border-emerald-500"
            : "border-zinc-300 dark:border-zinc-600 hover:border-emerald-400"
        )}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <motion.div
          initial={false}
          animate={{ scale: todo.completed ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Check size={14} className="text-white stroke-[3]" />
        </motion.div>
      </button>

      <span
        className={clsx(
          "flex-1 text-lg transition-all duration-300 break-words",
          todo.completed
            ? "text-zinc-400 line-through decoration-zinc-300 dark:decoration-zinc-600"
            : "text-zinc-700 dark:text-zinc-200"
        )}
      >
        {todo.title}
      </span>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
        aria-label="Delete todo"
      >
        <Trash2 size={18} />
      </button>
    </motion.li>
  );
}
