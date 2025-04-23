import {render, screen, fireEvent} from '@testing-library/react';
import Login from '@/app/log-in/page'; // Import the Login component
import '@testing-library/jest-dom'; // Import jest-dom for additional matchers
import { useRouter } from 'next/navigation';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

jest.mock ('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock ('react-firebase-hooks/auth', () => ({
  useSignInWithEmailAndPassword: jest.fn(),
}));

describe('Login Page', () => {
  it('renders the login page', () => {
    useSignInWithEmailAndPassword.mockReturnValue([
      jest.fn(), // signInWithEmailAndPassword function
      null, // userCredential
      false, // loading
      null, // error
    ]);
    render(<Login />); // Render the Login component
    const logInElements = screen.getAllByText('Log In'); // Get all elements with the text 'Log In'
    expect(logInElements.length).toBeGreaterThan(0); // Check if the login text is present
    expect(screen.getByText('Register')).toBeInTheDocument(); // Check if the email text is present
  });
});