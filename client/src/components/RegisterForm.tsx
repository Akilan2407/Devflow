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
    <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-xl">
      <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
      <input
        className="input"
        placeholder="Name"
        value={values.name}
        onChange={(event) => setValues({ ...values, name: event.target.value })}
      />
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
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
      <p className="text-sm text-slate-500">
        Already registered?{' '}
        <Link className="font-semibold text-cyan-700" to="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
};
