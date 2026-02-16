import { useState, useRef, useEffect } from 'react';
import { useUpdateTodo, useDeleteTodo } from '../hooks/useTodosQuery';
import { motion } from 'framer-motion';
import { Check, Trash2, Pencil, ChevronUp, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export function TodoItem({ todo, canMoveUp, canMoveDown, onMoveUp, onMoveDown, isReordering }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const inputRef = useRef(null);
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const isUpdating = updateTodo.isPending && updateTodo.variables?.id === todo._id;
  const isDeleting = deleteTodo.isPending && deleteTodo.variables === todo._id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(todo.title);
  }, [todo.title]);

  const handleToggle = () => {
    if (!isEditing) {
      updateTodo.mutate({ id: todo._id, completed: !todo.completed });
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteTodo.mutate(todo._id);
  };

  const handleEditStart = (e) => {
    e.stopPropagation();
    if (!todo.completed) setIsEditing(true);
  };

  const handleEditSubmit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.title) {
      updateTodo.mutate({ id: todo._id, title: trimmed });
    }
    setIsEditing(false);
    setEditValue(todo.title);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(todo.title);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') handleEditCancel();
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

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleEditKeyDown}
          className="flex-1 px-2 py-1 text-lg rounded border border-blue-400 dark:border-blue-500 bg-transparent text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <span
          onDoubleClick={handleEditStart}
          className={clsx(
            "flex-1 text-lg transition-all duration-300 break-words cursor-text",
            todo.completed
              ? "text-zinc-400 line-through decoration-zinc-300 dark:decoration-zinc-600"
              : "text-zinc-700 dark:text-zinc-200"
          )}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <>
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
              disabled={!canMoveUp || isReordering}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Move up"
            >
              <ChevronUp size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
              disabled={!canMoveDown || isReordering}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Move down"
            >
              <ChevronDown size={18} />
            </button>
          </div>
          <button
            onClick={handleEditStart}
            disabled={todo.completed}
            className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Edit todo"
          >
            <Pencil size={18} />
          </button>
        </>
      )}

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
