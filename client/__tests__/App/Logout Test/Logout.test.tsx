import { render, screen, waitFor } from "@testing-library/react";
import Logout from "@/app/logout/page";
import "@testing-library/jest-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("@/app/firebase/config", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Logout Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on console.error
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error
    jest.restoreAllMocks();
  });

  // Mock the sessionStorage to simulate user login state
  it("logs out the user and redirects to the home page", async () => {
    const mockPush = jest.fn(); // Mock the push function from useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (signOut as jest.Mock).mockResolvedValueOnce(undefined); // Mock signOut to resolve successfully

    render(<Logout />); // Render the Logout component

    expect(screen.getByText(/logging out/i)).toBeInTheDocument(); // Check if the logging out text is displayed

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth); // Check if signOut was called with the auth object
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/"); // Check if the user was redirected to the home page
    });
  });

  it("handles errors when signing out fails", async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock signOut to reject with an error
    const mockError = new Error("Logout failed");
    (signOut as jest.Mock).mockRejectedValueOnce(mockError);

    render(<Logout />);

    // Verify that the loading message is displayed
    expect(screen.getByText(/logging out/i)).toBeInTheDocument();

    // Wait for the error to be logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error signing out:",
        mockError
      );
    });

    // Verify the user stays on the same page (no redirect)
    expect(mockPush).not.toHaveBeenCalled();
  });
});
