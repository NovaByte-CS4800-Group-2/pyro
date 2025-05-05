import { render, screen, fireEvent, act } from "@testing-library/react";
import Login from "@/app/log-in/page";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

// Mock the modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useSignInWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
}));

jest.mock("@/app/firebase/config", () => ({
  auth: {},
}));

describe("Login Page", () => {
  const mockPush = jest.fn();
  const mockSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSignInWithEmailAndPassword as jest.Mock).mockReturnValue([
      mockSignIn, // signInWithEmailAndPassword function
      null, // userCredential
      false, // loading
      null, // error
    ]);
  });

  it("renders the login page", () => {
    render(<Login />);
    const logInElements = screen.getAllByText("Log In");
    expect(logInElements.length).toBeGreaterThan(0);
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("validates form inputs and shows error messages", async () => {
    render(<Login />);

    // Get input fields by placeholder instead of label
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitButton = screen.getByText("Log In", { selector: "button" });

    // Check initial button state (should be disabled)
    expect(submitButton).toBeDisabled();

    // Type in email only
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    });

    // Should still show password error and button should be disabled
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Clear email and type in password only
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    // Should show email error and button should be disabled
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Fill both fields correctly
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    });

    // Should enable the button
    expect(submitButton).not.toBeDisabled();
  });

  it("submits the form with valid inputs", async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitButton = screen.getByText("Log In", { selector: "button" });

    // Fill in form
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    // Submit form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check if signInWithEmailAndPassword was called with correct params
    expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("redirects to dashboard after successful login with verified email", async () => {
    // Mock successful login with verified email
    (useSignInWithEmailAndPassword as jest.Mock).mockReturnValue([
      mockSignIn,
      { user: { emailVerified: true } },
      false,
      null,
    ]);

    render(<Login />);

    // Check if router.push was called with dashboard
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("signs out and shows error message if email is not verified", async () => {
    // Mock successful login with unverified email
    (useSignInWithEmailAndPassword as jest.Mock).mockReturnValue([
      mockSignIn,
      { user: { emailVerified: false } },
      false,
      null,
    ]);

    render(<Login />);

    // Check if signOut was called
    expect(signOut).toHaveBeenCalled();

    // Check if error message is displayed
    expect(
      screen.getByText(
        "Please follow the link in your verification email before logging in!"
      )
    ).toBeInTheDocument();
  });

  it("displays firebase auth error messages", async () => {
    // Mock invalid credential error
    (useSignInWithEmailAndPassword as jest.Mock).mockReturnValue([
      mockSignIn,
      null,
      false,
      { code: "auth/invalid-credential" },
    ]);

    render(<Login />);

    // Check if proper error message is displayed
    expect(
      screen.getByText("Email and password do not match. Please try again.")
    ).toBeInTheDocument();
  });
  it("displays error for invalid email", async () => {
    // Mock invalid email error 
    (useSignInWithEmailAndPassword as jest.Mock).mockReturnValue([
      mockSignIn,
      null,
      false,
      { code: "auth/invalid-email" },
    ]);

    render(<Login />);

    // Check if proper error message is displayed
    expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
  });

  it("displays generic error for other firebase errors", async () => {
    // Mock other error 
    (useSignInWithEmailAndPassword as jest.Mock).mockReturnValue([
      mockSignIn,
      null,
      false,
      { code: "auth/some-other-error" },
    ]);

    render(<Login />);

    // Check if proper error message is displayed
    expect(
      screen.getByText("Failed to sign in. Please try again.")
    ).toBeInTheDocument();
  });
});
