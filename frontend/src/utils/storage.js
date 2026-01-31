const AUTH_KEY = 'todo_auth';
const TODOS_CACHE_KEY = 'todo_todos_cache';

export const storage = {
  getAuth() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setAuth(data) {
    try {
      if (data) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(data));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {
      console.warn('Failed to persist auth', e);
    }
  },

  clearAuth() {
    localStorage.removeItem(AUTH_KEY);
  },

  getTodosCache() {
    try {
      const raw = localStorage.getItem(TODOS_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setTodosCache(data) {
    try {
      if (data) {
        localStorage.setItem(TODOS_CACHE_KEY, JSON.stringify(data));
      } else {
        localStorage.removeItem(TODOS_CACHE_KEY);
      }
    } catch (e) {
      console.warn('Failed to persist todos cache', e);
    }
  },
};
