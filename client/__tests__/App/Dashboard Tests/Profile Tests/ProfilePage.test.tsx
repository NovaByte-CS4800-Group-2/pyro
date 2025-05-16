import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Profile from "@/app/dashboard/profile/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: () => [
    {
      displayName: "testuser",
      email: "test@example.com",
      photoURL: "https://example.com/image.png",
      uid: "123",
    },
  ],
  useUpdateProfile: () => [jest.fn(), null],
  useVerifyBeforeUpdateEmail: () => [jest.fn(), false, null],
  useUpdatePassword: () => [jest.fn(), false, null],
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue("https://example.com/image.png"),
}));

jest.mock("@heroui/react", () => ({
  Avatar: (props: any) => <img src={props.src} alt="avatar" />,
  Button: (props: any) => (
    <button onClick={props.onPress}>{props.children}</button>
  ),
  Card: (props: any) => <div>{props.children}</div>,
  CardBody: (props: any) => <div>{props.children}</div>,
  CardHeader: (props: any) => <div>{props.children}</div>,
  CircularProgress: () => <div>Loading...</div>,
  Input: (props: any) => <input {...props} />,
  Modal: (props: any) => <div>{props.children}</div>,
  ModalContent: (props: any) => <div>{props.children}</div>,
  ModalHeader: (props: any) => <div>{props.children}</div>,
  ModalBody: (props: any) => <div>{props.children}</div>,
  ModalFooter: (props: any) => <div>{props.children}</div>,
  useDisclosure: () => ({
    isOpen: false,
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

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    profile: {
      user_id: 1,
      username: "testuser",
      name: "Test User",
      zip_code: 12345,
      business_account: 0,
    },
  }),
});

describe("Profile Page", () => {
  it("renders the profile info after loading", async () => {
    render(<Profile />);
    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const avatar = screen.getByAltText("avatar") as HTMLImageElement;
    expect(avatar.src).toBe("https://example.com/image.png");

    expect(screen.getByTestId("forum")).toBeInTheDocument();
    expect(screen.getByTestId("comments")).toBeInTheDocument();
  });
});
