import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Profile from "@/app/dashboard/profile/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockVerifyEmail = jest.fn().mockResolvedValue(true);
const mockUpdateProfile = jest.fn().mockResolvedValue(true);
const mockUpdatePassword = jest.fn().mockResolvedValue(true);

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: () => [
    {
      displayName: "testuser",
      email: "old@example.com", // force email mismatch
      photoURL: "https://example.com/image.png",
      uid: "123",
    },
  ],
  useUpdateProfile: () => [mockUpdateProfile, null],
  useVerifyBeforeUpdateEmail: () => [mockVerifyEmail, false, null],
  useUpdatePassword: () => [mockUpdatePassword, false, null],
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue("https://example.com/image.png"),
}));

jest.mock("@heroui/react", () => ({
  Avatar: (props: any) => (
    <img
      src={props.src}
      alt="avatar"
      onClick={props.onClick || props.onPress}
    />
  ),
  Button: (props: any) => (
    <button
      onClick={props.onClick || props.onPress}
      disabled={props.isDisabled || props.disabled}
    >
      {props.children}
    </button>
  ),
  Card: (props: any) => <div>{props.children}</div>,
  CardBody: (props: any) => <div>{props.children}</div>,
  CardHeader: (props: any) => <div>{props.children}</div>,
  CircularProgress: () => <div>Loading...</div>,
  Input: (props: any) => <input {...props} />,
  Modal: (props: any) => <div>{props.children}</div>,
  ModalContent: (props: any) => (
    <div>
      {typeof props.children === "function"
        ? props.children(() => {})
        : props.children}
    </div>
  ),
  ModalHeader: (props: any) => <div>{props.children}</div>,
  ModalBody: (props: any) => <div>{props.children}</div>,
  ModalFooter: (props: any) => <div>{props.children}</div>,
  useDisclosure: () => ({
    isOpen: true,
    onOpen: jest.fn(),
    onOpenChange: jest.fn(),
  }),
  Tabs: (props: any) => <div>{props.children}</div>,
  Tab: (props: any) => <div>{props.children}</div>,
  addToast: jest.fn(),
}));

jest.mock("@/app/ui/forum", () => () => (
  <div data-testid="forum">Mock Forum</div>
));
jest.mock("@/app/ui/comments", () => () => (
  <div data-testid="comments">Mock Comments</div>
));

global.fetch = jest.fn((url) => {
  const createResponse = (body: any, ok = true) =>
    Promise.resolve({
      ok,
      status: ok ? 200 : 400,
      json: async () => body,
      text: async () => JSON.stringify(body),
      headers: { get: () => null },
      redirected: false,
      statusText: ok ? "OK" : "Bad Request",
      type: "basic",
      url: typeof url === "string" ? url : "",
      clone: function () {
        return this;
      },
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
    } as unknown as Response);

  if (
    typeof url === "string" &&
    (url.includes("/profile/editUsername") ||
      url.includes("/profile/editZipcode"))
  ) {
    return createResponse({}, true);
  }
  if (typeof url === "string" && url.includes("/profile/testuser")) {
    return createResponse(
      {
        profile: {
          user_id: 1,
          username: "testuser",
          name: "Test User",
          zip_code: 12345,
          business_account: 0,
        },
      },
      true
    );
  }
  return createResponse({}, false);
});

describe("Profile Page", () => {
  it("renders the profile info after loading", async () => {
    render(<Profile />);
    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });
    expect(screen.getByAltText("avatar")).toHaveAttribute(
      "src",
      expect.stringContaining("example.com")
    );
    expect(screen.getByTestId("forum")).toBeInTheDocument();
    expect(screen.getByTestId("comments")).toBeInTheDocument();
  });

  /* it("allows editing username, email, and zipcode", async () => {
    render(<Profile />);

    await screen.findByText("Edit Information");
    fireEvent.click(screen.getByText("Edit Information"));

    // Change username
    fireEvent.change(screen.getByDisplayValue("testuser"), {
      target: { value: "newuser" },
    });

    // Change email to a different value than mocked userProfile.email
    const emailInput = screen.getByDisplayValue("old@example.com");
    fireEvent.change(emailInput, {
      target: { value: "different@example.com" },
    });

    // Change zipcode
    fireEvent.change(screen.getByDisplayValue("12345"), {
      target: { value: "54321" },
    });

    const buttons = screen.getAllByText("Save");

    // Click Save buttons directly
    fireEvent.click(buttons[0]); // Username
    fireEvent.click(buttons[1]); // Email
    fireEvent.click(buttons[2]); // Zipcode

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
      expect(mockVerifyEmail).toHaveBeenCalledWith(
        "different@example.com",
        null
      );
    });
  });

  it("handles password change modal", async () => {
    render(<Profile />);
    await screen.findByText("Edit Information");
    fireEvent.click(screen.getByText("Edit Information"));

    const changePasswordButton = screen.getByText("Change Password");
    fireEvent.click(changePasswordButton);

    fireEvent.change(screen.getByLabelText("Enter Old Password"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("Enter New Password"), {
      target: { value: "newpass" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "newpass" },
    });

    fireEvent.click(screen.getByText("Save"));
    expect(mockUpdatePassword).toHaveBeenCalled();
  });

  it("shows password mismatch warning", async () => {
    render(<Profile />);
    await screen.findByText("Edit Information");
    fireEvent.click(screen.getByText("Edit Information"));
    fireEvent.click(screen.getByText("Change Password"));

    fireEvent.change(screen.getByLabelText("Enter New Password"), {
      target: { value: "newpass" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "wrongpass" },
    });

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });

  it("handles profile picture modal and upload", async () => {
    render(<Profile />);
    await screen.findByText("Edit Information");
    const avatar = screen.getByAltText("avatar");
    fireEvent.click(avatar);

    const fileInput = screen.getByLabelText(/file/i);
    const file = new File(["dummy"], "pic.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const saveButtons = screen.getAllByText("Save");
    fireEvent.click(saveButtons.pop()!); // save in modal
  });
  */
});
