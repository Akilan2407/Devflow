import type { ReactElement } from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = (): ReactElement => (
  <main className="auth-page">
    <LoginForm />
  </main>
);
