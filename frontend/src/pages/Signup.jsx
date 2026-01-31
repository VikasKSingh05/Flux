import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import styles from './Auth.module.css';

export function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await authApi.signup(data.email, data.password);
      const { token, user } = res.data.data;
      login(token, user);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Signup failed';
      setError('root', { message: msg });
    }
  };

  return (
    <Layout>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign up</h1>
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
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
              className={styles.input}
              autoComplete="new-password"
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
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </Layout>
  );
}
