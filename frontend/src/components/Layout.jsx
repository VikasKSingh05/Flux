import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/useUIStore';
import styles from './Layout.module.css';

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

  return (
    <div className={styles.wrapper} data-theme={theme}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Todo
        </Link>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeBtn}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user && (
            <>
              <span className={styles.email}>{user.email}</span>
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
