import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from '../components/LoginForm';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuthStore } from '../stores/auth.store';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('../lib/api', () => ({
  apiClient: {
    post: vi.fn(async (_path: string, input: { email: string; password: string }) => ({
      data: { data: { user: { _id: 'user-1', name: 'Test User', email: input.email }, accessToken: 'token' } },
    })),
  },
}));

describe('frontend authentication and protected routing', () => {
  beforeEach(() => {
    navigate.mockReset();
    useAuthStore.setState({ user: null, accessToken: null, isLoading: false, error: null });
  });

  it('rejects invalid login input before making an API call', async () => {
    render(<MemoryRouter><LoginForm /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it('logs in valid credentials and navigates to organizations', async () => {
    render(<MemoryRouter><LoginForm /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/organizations'));
    expect(useAuthStore.getState().accessToken).toBe('token');
  });

  it('redirects unauthenticated users from protected routes', () => {
    render(<MemoryRouter><ProtectedRoute /></MemoryRouter>);
    expect(screen.queryByText(/loading session/i)).not.toBeInTheDocument();
  });
});
