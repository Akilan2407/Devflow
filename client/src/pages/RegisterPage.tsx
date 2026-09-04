import type { ReactElement } from 'react';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage = (): ReactElement => (
  <main className="auth-page">
    <RegisterForm />
  </main>
);
