import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/useUIStore';
import { Moon, Sun, LogOut, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className={`min-h-screen font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500 ${isDark ? 'dark' : ''}`}>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/50 supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-zinc-900/40"
      >
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-white" strokeWidth={3} />
              </div>
            </motion.div>
            <span className="bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">Flux</span>
          </Link>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ rotate: 15 }}
              type="button"
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {user && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 pl-3 border-l border-zinc-200 dark:border-zinc-700"
                >
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hidden sm:block">
                    {user.email?.split('@')[0]}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1, color: "#ef4444" }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="p-2 text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <main className="max-w-3xl mx-auto w-full px-6 pt-12 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={user ? 'app' : 'auth'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
