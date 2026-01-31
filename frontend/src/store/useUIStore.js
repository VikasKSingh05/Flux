import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'light',
      todoFilter: 'all', 

      setTheme(theme) {
        set({ theme });
      },

      setTodoFilter(filter) {
        set({ todoFilter: filter });
      },
    }),
    { name: 'todo_ui' }
  )
);
