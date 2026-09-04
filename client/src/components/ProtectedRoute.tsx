import type { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export const ProtectedRoute = (): ReactElement => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return <p className="p-8 text-slate-400">Loading session...</p>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
