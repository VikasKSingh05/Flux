import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';

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

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-[#0f3460] bg-white dark:bg-[#0f3460] text-gray-900 dark:text-gray-100 text-base focus:outline-2 focus:outline-blue-500 focus:outline-offset-2';

  return (
    <Layout>
      <div className="bg-white dark:bg-[#16213e] border border-gray-200 dark:border-[#0f3460] rounded-xl p-8 max-w-md mx-auto">
        <h1 className="mb-6 text-3xl text-gray-900 dark:text-gray-100">Sign up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-gray-900 dark:text-gray-100">
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
              className={inputClass}
              autoComplete="email"
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-900 dark:text-gray-100">
            Password
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
              className={inputClass}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </label>
          {errors.root && (
            <p className="py-2 text-sm text-red-500" role="alert">
              {errors.root.message}
            </p>
          )}
          <button
            type="submit"
            className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold mt-2 border-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-900 dark:text-gray-100 opacity-90">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 no-underline hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </Layout>
  );
}
