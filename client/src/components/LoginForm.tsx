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
    <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-2xl border border-surface-800 bg-[#0E1522]/95 p-8 shadow-2xl backdrop-blur-xl">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Security Gate</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">Sign in to your DevFlow engineering workspace.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-300">Email Address</label>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={values.email}
            onChange={(event) => setValues({ ...values, email: event.target.value })}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <span className="text-xs text-brand-400 hover:underline cursor-pointer">Forgot?</span>
          </div>
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={values.password}
            onChange={(event) => setValues({ ...values, password: event.target.value })}
          />
        </div>
      </div>

      {(validationError || error) && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2">
          <span>⚠️</span>
          <span>{validationError || error}</span>
        </div>
      )}

      <button className="button w-full shadow-lg shadow-brand-500/25" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="pt-2 text-center text-xs text-slate-400">
        New to DevFlow?{' '}
        <Link className="font-semibold text-brand-400 hover:text-brand-300 transition" to="/register">
          Create an enterprise account
        </Link>
      </div>
    </form>
  );
};

