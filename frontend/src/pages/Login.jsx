import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data.email, data.password);
      const { token, user } = res.data.data;
      login(token, user);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError('root', { message: msg });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Lock className="text-white" size={24} />
            </motion.div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Welcome back</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Sign in to continue to Todo</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email',
                    },
                  })}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="text-sm text-red-500 pl-1">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <span className="text-sm text-red-500 pl-1">{errors.password.message}</span>
              )}
            </div>

            {errors.root && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-lg text-center"
              >
                {errors.root.message}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-600 font-medium hover:underline transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
