import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/useUIStore';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen ${isDark ? 'dark' : ''} bg-gray-100 dark:bg-[#1a1a2e] text-gray-900 dark:text-gray-100`}
    >
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#16213e] border-b border-gray-200 dark:border-[#0f3460] shadow-sm">
        <Link to="/" className="text-2xl font-bold text-inherit no-underline">
          Todo
        </Link>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 rounded-lg border border-gray-200 dark:border-[#0f3460] bg-transparent text-xl cursor-pointer"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user && (
            <>
              <span className="text-sm text-inherit opacity-90">{user.email}</span>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm cursor-pointer border-0"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>
      <main className="max-w-2xl mx-auto py-8 px-4">{children}</main>
    </div>
  );
}
