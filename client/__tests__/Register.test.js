import {render, screen, waitFor } from '@testing-library/react';
import  Register  from '@/app/register/page';
import '@testing-library/jest-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

// Mock dependencies
jest.mock("react-firebase-hooks/auth", () => {
  const originalModule = jest.requireActual("react-firebase-hooks/auth");

  return { // Mocking the useAuthState hook and other hooks from react-firebase-hooks/auth
    __esModule: true, 
    ...originalModule, 
    useAuthState: jest.fn(() => [null, false]),
    useCreateUserWithEmailAndPassword: jest.fn(() => [
      jest.fn(), // createUserWithEmailAndPassword
      null,      // userCredential
      false,     // loading
      null       // error
    ]),
    useUpdateProfile: jest.fn(() => [jest.fn()]), // Mocking useUpdateProfile
  };
});

// Mocking the useRouter and usePathname hooks from next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: jest.fn(),
}));

// rendering the Register component
describe("Register Page", () => { 
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it ("renders the Register component", async () => { 
    useAuthState.mockReturnValue([null, false]); // Simulate unauthenticated user
    
    render(<Register />); 
    await waitFor(() => { 
      expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  //need to test forum submission and redirection to dashboard 
  
});
});
