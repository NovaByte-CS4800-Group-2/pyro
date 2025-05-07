import { render, screen, act } from '@testing-library/react';
import RootLayout from '@/app/dashboard/layout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter, usePathname } from 'next/navigation';

// Mock dependencies
jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('@/app/firebase/config', () => ({
  auth: {},
}));

jest.mock('@/app/ui/navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('@heroui/react', () => ({
  CircularProgress: () => <div data-testid="loading-spinner">Loading</div>,
}));



describe('RootLayout', () => {
  it('renders dashboard with navbar when user is authenticated', async () => {
    // Setup authenticated user
    (useAuthState as jest.Mock).mockReturnValue([{ uid: '123' }, false, null]);
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    
  // Mock sessionStorage
  global.sessionStorage = {
    getItem: jest.fn().mockReturnValue(null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  };
  
  // Use act to handle the useEffect and state updates
  await act(async () => {
    render(<RootLayout>Dashboard Content</RootLayout>);
  });
  
  // Verify dashboard is rendered with navbar and content
  expect(screen.getByTestId('navbar')).toBeInTheDocument();
  expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
});
});

it('redirects to home when user is not authenticated and not on dashboard page', async () => {
  // Setup: user is not authenticated and path is not dashboard
  const mockPush = jest.fn();
  (useAuthState as jest.Mock).mockReturnValue([null, false, null]); // No user
  (usePathname as jest.Mock).mockReturnValue('/account'); // Not a dashboard path
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  
  // Use act to handle the useEffect and state updates
  await act(async () => {
    render(<RootLayout>Dashboard Content</RootLayout>);
  });
  
  // Verify the redirect was called
  expect(mockPush).toHaveBeenCalledWith('/');
});

