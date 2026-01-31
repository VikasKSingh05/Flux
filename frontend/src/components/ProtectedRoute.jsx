import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function ProtectedRoute({ children }) {
  const { token, user } = useAuthStore();
  const location = useLocation();
  const isAuthenticated = Boolean(token && user);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
