// __tests__/Signup.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../../../app/signup/Signup';
import * as nextAuth from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Signup Component', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('renders all fields', () => {
    render(<Signup />);
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<Signup />);
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email cannot be empty/i)).toBeInTheDocument();
    });
  });

  it('shows error if passwords do not match', async () => {
    render(<Signup />);
    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: 'password456' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('submits form and calls signIn', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ email: 'test@example.com' }),
      } as Response)
    ) as jest.Mock;

    // Mock signIn
    const signInMock = jest.spyOn(nextAuth, 'signIn').mockResolvedValue({ ok: true, url: '/' } as any);

    render(<Signup />);
    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/signup', expect.any(Object));
      expect(signInMock).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      }));
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });
});
