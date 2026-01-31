/**
 * Zustand store: auth (token + user in memory).
 * Persisted to LocalStorage via hooks; token getter registered for axios.
 */
import { create } from 'zustand';
import { storage } from '../utils/storage';

export const useAuthStore = create((set) => ({
  token: null,
  user: null,

  setAuth(token, user) {
    set({ token, user });
  },

  clearAuth() {
    set({ token: null, user: null });
  },

  // Hydrate from LocalStorage on app load
  hydrate() {
    const saved = storage.getAuth();
    if (saved?.token && saved?.user) {
      set({ token: saved.token, user: saved.user });
      return true;
    }
    return false;
  },
}));
