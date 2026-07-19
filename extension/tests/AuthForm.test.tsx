import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthForm } from '../src/components/AuthForm';

jest.mock('../src/services/apiService');
jest.mock('../src/services/storageService');

describe('AuthForm Component', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form by default', () => {
    render(<AuthForm onSuccess={mockOnSuccess} />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('should toggle between login and signup forms', () => {
    render(<AuthForm onSuccess={mockOnSuccess} />);
    const toggleButton = screen.getByText(/sign up/i);
    fireEvent.click(toggleButton);
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
  });
});
