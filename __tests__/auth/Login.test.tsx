// __tests__/auth/Login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../app/login/Login';
import * as nextAuth from 'next-auth/react';

jest.mock('next-auth/react');

describe('Login Component', () => {
  const signInMock = jest.spyOn(nextAuth, 'signIn');

  beforeAll(() => {
    // Mock alert globally
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    // Optionally, mock console.error to suppress login error logs in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and buttons', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
  });

  it('shows error when email or password is empty', () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    expect(window.alert).toHaveBeenCalledWith('Email cannot be empty');
  });

  it('calls signIn with credentials on submit', async () => {
    signInMock.mockResolvedValue({ ok: true, url: '/' } as any);

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        callbackUrl: '/',
        redirect: false,
      });
    });
  });

  it('shows error message if signIn fails', async () => {
    signInMock.mockResolvedValue({ error: 'Invalid credentials' } as any);

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });
});
