/**
 * Auth hook: login, signup, logout, and persist to LocalStorage.
 * Logout clears Zustand and storage, and triggers auth:logout for redirect.
 */
import { useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { storage } from '../utils/storage';

export function useAuth() {
  const { token, user, setAuth, clearAuth } = useAuthStore();

  const login = useCallback(
    (newToken, newUser) => {
      setAuth(newToken, newUser);
      storage.setAuth({ token: newToken, user: newUser });
    },
    [setAuth]
  );

  const logout = useCallback(() => {
    clearAuth();
    storage.clearAuth();
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }, [clearAuth]);

  const isAuthenticated = Boolean(token && user);

  return { token, user, login, logout, isAuthenticated };
}
