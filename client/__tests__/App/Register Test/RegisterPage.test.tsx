import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "@/app/register/page";
import { useRouter } from "next/navigation";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
  useUpdateProfile,
} from "react-firebase-hooks/auth";

// Mock required dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useCreateUserWithEmailAndPassword: jest.fn(),
  useSendEmailVerification: jest.fn(),
  useUpdateProfile: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
}));

jest.mock("@/app/firebase/config", () => ({
  auth: {},
}));

describe("Register Component", () => {
  // Setup common mocks before each test
  beforeEach(() => {
    // Reset the error mocks
    (useCreateUserWithEmailAndPassword as jest.Mock).mockReturnValue([
      jest
        .fn()
        .mockResolvedValue({ user: { uid: "test-uid", delete: jest.fn() } }),
      null, // credentials
      false, // loading
      null, // error
    ]);

    (useUpdateProfile as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue(true),
      false, // loading
      null, // error
    ]);

    (useSendEmailVerification as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue(true),
      false, // sending
      null, // error
    ]);

    // Mock router
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock fetch API
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    // Mock environment variable
    process.env.NEXT_PUBLIC_BACKEND_URL = "https://api-test.example.com";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders register form correctly", () => {
    render(<Register />);

    // Check for main elements
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText("Already registered?")).toBeInTheDocument();
    expect(screen.getByLabelText("Business")).toBeInTheDocument();
    expect(screen.getByLabelText("Personal")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();
  });

  test("fills and submits form successfully", async () => {
    const { container } = render(<Register />);

    // Get all input fields from the form
    const inputFields = container.querySelectorAll("input");
    const nameInput = inputFields[0]; // Name field
    const emailInput = inputFields[1]; // Email field
    const usernameInput = inputFields[2]; // Username field
    const zipCodeInput = inputFields[3]; // Zip Code field
    const passwordInput = inputFields[6]; // Password field
    const confirmPasswordInput = inputFields[7]; // Confirm Password field

    // Fill the form
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(zipCodeInput, { target: { value: "12345" } });
    fireEvent.change(passwordInput, { target: { value: "TestPass123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "TestPass123!" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for async operations
    await waitFor(() => {
      // Check if createUserWithEmailAndPassword was called
      expect(useCreateUserWithEmailAndPassword as jest.Mock).toHaveBeenCalled();

      // Check if the fetch was called with correct data
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api-test.example.com/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.any(String),
        })
      );

      // Check that router.push was called (redirect after successful registration)
      const mockRouter = useRouter();
      expect(mockRouter.push).toHaveBeenCalledWith("/register/verification");
    });
  });

  // Test for all different types of backend validation errors
  test("shows different backend validation errors for each field", async () => {
    // Mock fetch to return validation errors for all fields
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        errors: [
          "Name is required",
          "Email format is invalid",
          "Username is already taken",
          "ZipCode must be 5 digits",
          "Password is too weak",
        ],
      }),
    });

    const { container } = render(<Register />);

    // Get required input fields from the form
    const inputFields = container.querySelectorAll("input");
    const nameInput = inputFields[0]; // Name field
    const emailInput = inputFields[1]; // Email field
    const usernameInput = inputFields[2]; // Username field
    const zipCodeInput = inputFields[3]; // Zip Code field
    const passwordInput = inputFields[6]; // Password field
    const confirmPasswordInput = inputFields[7]; // Confirm Password field

    // Fill the form with valid data
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(zipCodeInput, { target: { value: "12345" } });
    fireEvent.change(passwordInput, { target: { value: "TestPass123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "TestPass123!" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for async operations and check all error messages
    await waitFor(() => {
      expect(screen.getByText(/Email format is invalid/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Username is already taken/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/ZipCode must be 5 digits/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is too weak/i)).toBeInTheDocument();
    });
  });

  // Test for Firebase email already in use error
  test("shows error when email is already in use", async () => {
    // Mock Firebase error for email already in use
    (useCreateUserWithEmailAndPassword as jest.Mock).mockReturnValue([
      jest.fn(),
      null, // credentials
      false, // loading
      { code: "auth/email-already-in-use" }, // error
    ]);

    render(<Register />);

    // After render, check if Firebase error message appears
    await waitFor(() => {
      expect(
        screen.getByText(/This email is already registered to an account/i)
      ).toBeInTheDocument();
    });
  });

  // Test for Firebase password requirements error
  test("shows error when password does not meet requirements", async () => {
    // Mock Firebase error for password requirements
    (useCreateUserWithEmailAndPassword as jest.Mock).mockReturnValue([
      jest.fn(),
      null, // credentials
      false, // loading
      { code: "auth/password-does-not-meet-requirements" }, // error
    ]);

    render(<Register />);

    // After render, check if Firebase error message appears
    await waitFor(() => {
      expect(
        screen.getByText(/Your password must be at least 8 characters long/i)
      ).toBeInTheDocument();
    });
  });

  // Test for default Firebase error
  test("shows default error for other Firebase errors", async () => {
    // Mock a generic Firebase error
    (useCreateUserWithEmailAndPassword as jest.Mock).mockReturnValue([
      jest.fn(),
      null, // credentials
      false, // loading
      { code: "auth/network-error" }, // some other error code
    ]);

    render(<Register />);

    // After render, check if default error message appears
    await waitFor(() => {
      expect(screen.getByText("auth/network-error")).toBeInTheDocument();
    });
  });

  // Test for verification email error
  test("shows error when verification email fails to send", async () => {
    // Mock successful registration but failed email verification
    (useCreateUserWithEmailAndPassword as jest.Mock).mockReturnValue([
      jest
        .fn()
        .mockResolvedValue({ user: { uid: "test-uid", delete: jest.fn() } }),
      null, // credentials
      false, // loading
      null, // no error
    ]);

    (useSendEmailVerification as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue(false), // Email sending fails
      false, // sending
      { message: "Failed to send verification email" }, // verification error
    ]);

    const { container } = render(<Register />);

    // Get required input fields and fill the form
    const inputFields = container.querySelectorAll("input");
    const nameInput = inputFields[0];
    const emailInput = inputFields[1];
    const usernameInput = inputFields[2];
    const zipCodeInput = inputFields[3];
    const passwordInput = inputFields[6];
    const confirmPasswordInput = inputFields[7];

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(zipCodeInput, { target: { value: "12345" } });
    fireEvent.change(passwordInput, { target: { value: "TestPass123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "TestPass123!" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for async operations
    await waitFor(() => {
      expect(
        screen.getByText(/Error sending verification email/i)
      ).toBeInTheDocument();
    });
  });

  // Test for unexpected error during sign-up
  test("shows error when an unexpected error occurs", async () => {
    // Mock createUserWithEmailAndPassword to throw an error
    (useCreateUserWithEmailAndPassword as jest.Mock).mockReturnValue([
      jest.fn().mockRejectedValue(new Error("Network failure")),
      null, // credentials
      false, // loading
      null, // no error
    ]);

    const { container } = render(<Register />);

    // Get required input fields and fill the form
    const inputFields = container.querySelectorAll("input");
    const nameInput = inputFields[0];
    const emailInput = inputFields[1];
    const usernameInput = inputFields[2];
    const zipCodeInput = inputFields[3];
    const passwordInput = inputFields[6];
    const confirmPasswordInput = inputFields[7];

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(zipCodeInput, { target: { value: "12345" } });
    fireEvent.change(passwordInput, { target: { value: "TestPass123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "TestPass123!" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    const error = await screen.findByText(/An unexpected error occurred/i);
    expect(error).toBeInTheDocument();
  });
});
