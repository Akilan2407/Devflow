import type { FormEvent, ReactElement } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '../stores/auth.store';

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const LoginForm = (): ReactElement => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { isLoading, error } = useAuthStore();
  const [values, setValues] = useState({ email: '', password: '' });
  const [validationError, setValidationError] = useState('');

  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      setValidationError('Enter a valid email and a password of at least 8 characters.');
      return;
    }
    setValidationError('');
    try {
      await login(result.data);
      navigate('/organizations');
    } catch {
      // Store exposes the API error to the form.
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-xl">
      <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
      <p className="text-slate-500">Sign in to your DevFlow workspace.</p>
      <input
        className="input"
        placeholder="Email"
        type="email"
        value={values.email}
        onChange={(event) => setValues({ ...values, email: event.target.value })}
      />
      <input
        className="input"
        placeholder="Password"
        type="password"
        value={values.password}
        onChange={(event) => setValues({ ...values, password: event.target.value })}
      />
      {(validationError || error) && (
        <p className="text-sm text-red-600">{validationError || error}</p>
      )}
      <button className="button" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
      <p className="text-sm text-slate-500">
        New to DevFlow?{' '}
        <Link className="font-semibold text-cyan-700" to="/register">
          Create an account
        </Link>
      </p>
    </form>
  );
};
