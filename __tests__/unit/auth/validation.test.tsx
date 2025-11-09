// __tests__/validation.test.ts
import { validateEmail, validatePassword } from '../../../app/signup/Signup';

describe('Email Validation', () => {
  it('returns error for empty email', () => {
    expect(validateEmail('')).toBe('Email cannot be empty');
  });

  it('returns error for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe('Please enter a valid email address');
    expect(validateEmail('abc@')).toBe('Please enter a valid email address');
    expect(validateEmail('abc.com')).toBe('Please enter a valid email address');
  });

  it('returns null for valid email', () => {
    expect(validateEmail('test@example.com')).toBeNull();
  });
});

describe('Password Validation', () => {
  it('returns error for empty password', () => {
    expect(validatePassword('')).toBe('Password cannot be empty');
  });

  it('returns error for password shorter than 8 chars', () => {
    expect(validatePassword('1234567')).toBe('Password must be at least 8 characters');
  });

  it('returns null for valid password', () => {
    expect(validatePassword('password123')).toBeNull();
  });
});
