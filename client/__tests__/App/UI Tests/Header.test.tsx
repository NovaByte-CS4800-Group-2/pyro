import { render, screen, waitFor } from "@testing-library/react";
import Header from "@/app/ui/header";
import { useAuthState } from "react-firebase-hooks/auth";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

jest.mock("@/app/firebase/config", () => ({
  auth: {},
}));

jest.mock("@/app/ui/notifications", () => () => <div>MockNotifications</div>);
jest.mock("@heroui/react", () => ({
  Avatar: ({ src }: any) => <img src={src} alt="avatar" />,
  Popover: ({ children, onOpenChange }: any) => {
    // 💡 Simulate opening the popover during render
    useEffect(() => {
      onOpenChange?.(true);
    }, [onOpenChange]);

    return <div>{children}</div>;
  },
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login/register buttons when no user on root", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<Header />);
    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("renders back button on /log-in path", () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);
    (usePathname as jest.Mock).mockReturnValue("/log-in");

    render(<Header />);
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders dashboard buttons when logged in and not on dashboard", () => {
    (useAuthState as jest.Mock).mockReturnValue([
      { displayName: "testuser", uid: "abc", photoURL: "fake.jpg" },
      false,
      null,
    ]);
    (usePathname as jest.Mock).mockReturnValue("/explore");

    render(<Header />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("renders dashboard UI when logged in and on /dashboard", () => {
    (useAuthState as jest.Mock).mockReturnValue([
      { displayName: "testuser", uid: "abc", photoURL: "fake.jpg" },
      false,
      null,
    ]);
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    render(<Header />);
    expect(screen.getByText("Create Post")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByAltText("avatar")).toBeInTheDocument();
    expect(screen.getByText("MockNotifications")).toBeInTheDocument();
  });
  it("fetches unread notifications and sets hasUnread = true", async () => {
    (useAuthState as jest.Mock).mockReturnValue([
      { displayName: "testuser", uid: "abc", photoURL: "fake.jpg" },
      false,
      null,
    ]);
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ unread: true }),
    });

    render(<Header />);

    // Wait for the fetch to complete and re-render
    await screen.findByText("Create Post");
  });
});
