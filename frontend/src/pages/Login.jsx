import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import styles from './Auth.module.css';

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
    <Layout>
      <div className={styles.card}>
        <h1 className={styles.title}>Log in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label className={styles.label}>
            Email
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email',
                },
              })}
              className={styles.input}
              autoComplete="email"
            />
            {errors.email && (
              <span className={styles.fieldError}>{errors.email.message}</span>
            )}
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className={styles.input}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className={styles.fieldError}>{errors.password.message}</span>
            )}
          </label>
          {errors.root && (
            <p className={styles.rootError} role="alert">
              {errors.root.message}
            </p>
          )}
          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className={styles.footer}>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </Layout>
  );
}
