import { render, screen, waitFor } from "@testing-library/react";
import RootLayout from "@/app/dashboard/layout";
import "@testing-library/jest-dom";
import "whatwg-fetch";

// Mock dependencies
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(), // Mock usePathname
}));

// Mock the sessionStorage to simulate user login state
describe("RootLayout Component", () => {
  // Test suite for RootLayout component
  beforeEach(() => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard"); // Simulate the current path
  });

  it("renders the CircularProgress when authenticating", async () => {
    // Test for CircularProgress during authentication
    const { useAuthState } = require("react-firebase-hooks/auth");
    useAuthState.mockReturnValue([null, true]); // Simulate authenticating state

    render(
      // RootLayout component
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    // Check for CircularProgress
    const circularProgressElement = screen.getByLabelText("Authenticating ...");
    expect(circularProgressElement).toBeInTheDocument();

    // Check for "Authenticating ..." text
    expect(screen.getByText("Authenticating ...")).toBeInTheDocument();
  });

  // Test for rendering the navigation links and children when authenticated
  it("renders the navigation links and children when authenticated", async () => {
    const { useAuthState } = require("react-firebase-hooks/auth");
    useAuthState.mockReturnValue([{ uid: "123" }, false]); // Simulate authenticated user

    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    await waitFor(() => {
      // Check if one of the navigation links is rendered
      const forumLink = screen.getByText("Forum");
      expect(forumLink).toBeInTheDocument();

      // Check if the children are rendered
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });

  // Test for redirecting to '/' if the user is not authenticated
  it("redirects to '/' if the user is not authenticated", async () => {
    const { useRouter } = require("next/navigation");
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    const { useAuthState } = require("react-firebase-hooks/auth"); // Mock useAuthState
    useAuthState.mockReturnValue([null, false]); // Simulate unauthenticated state

    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/"); // Check if the user was redirected to the home page
    });
  });
});
