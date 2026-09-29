import type { FormEvent, ReactElement } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '../stores/auth.store';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterForm = (): ReactElement => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const { isLoading, error } = useAuthStore();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [validationError, setValidationError] = useState('');

  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      setValidationError('Enter a name, valid email, and password of at least 8 characters.');
      return;
    }
    setValidationError('');
    try {
      await register(result.data);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Enterprise Onboarding</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Create your account</h1>
        <p className="mt-1 text-sm text-slate-400">Join DevFlow to collaborate with your engineering team.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-300">Full Name</label>
          <input
            className="input"
            placeholder="Name"
            value={values.name}
            onChange={(event) => setValues({ ...values, name: event.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-300">Work Email</label>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={values.email}
            onChange={(event) => setValues({ ...values, email: event.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-300">Password (8+ characters)</label>
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
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>

      <div className="pt-2 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link className="font-semibold text-brand-400 hover:text-brand-300 transition" to="/login">
          Sign in
        </Link>
      </div>
    </form>
  );
};

