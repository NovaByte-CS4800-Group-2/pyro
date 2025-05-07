import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePost from "@/app/dashboard/createpost/page";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("react-firebase-hooks/auth", () => ({ useAuthState: jest.fn() }));
jest.mock("@/app/firebase/config", () => ({ auth: {} }));
jest.mock("@heroui/react", () => ({
  Button: ({ children, onPress, disabled }: any) => (
    <button disabled={disabled} onClick={onPress}>
      {children}
    </button>
  ),
  ToastProvider: ({ children }: any) => <>{children}</>,
  Textarea: (props: any) => <textarea {...props} />,
  User: () => null,
}));
jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(() => Promise.resolve()),
  getDownloadURL: jest.fn(() => Promise.resolve("https:mocked.url/media.png")),
}));

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

const mockPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock) = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  (useAuthState as jest.Mock).mockReturnValue([
    { displayName: "testuser" },
    false,
    null,
  ]);
});

describe("CreatePost Component - Full Coverage", () => {
  const defaultFetchMocks = () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rows: [{ subforum_id: 1, name: "General" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            user_id: "123",
            username: "testuser",
            city: "General",
            business_account: 0,
          },
        }),
      });
  };

  test("renders correctly for personal user", async () => {
    defaultFetchMocks();
    render(<CreatePost />);
    await screen.findByText("New Post");
    expect(screen.getByText("Add Media")).toBeInTheDocument();
  });

  test("handles empty post submit", async () => {
    defaultFetchMocks();
    render(<CreatePost />);
    await screen.findByText("New Post");
    const postButton = screen.getByRole("button", { name: /Post/i });
    expect(postButton).toBeDisabled();
  });

  test("handles failed subforum fetch", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce("Subforum fetch failed");
    (global.fetch as jest.Mock).mockRejectedValueOnce("User fetch failed");

    render(<CreatePost />);
    await waitFor(() =>
      expect(screen.getByText("Failed to fetch user data.")).toBeInTheDocument()
    );
  });

  test("handles failed user fetch", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "fail" }),
      });
    render(<CreatePost />);
    await screen.findByText("New Post");
    expect(screen.getByText("Add Media")).toBeInTheDocument();
  });

  test("handles cancel for business account", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "bizuser",
            user_id: "99",
            city: "",
            business_account: 1,
          },
        }),
      });
    render(<CreatePost />);
    await screen.findByText("New Post");
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith("/dashboard/fundraiser")
    );
  });

  test("handles cancel for personal account", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "123",
            city: "General",
            business_account: 0,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ subforumId: 7 }),
      });

    render(<CreatePost />);
    await screen.findByText("New Post");
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith("/dashboard/subforum/7")
    );
  });

  test("submits personal post with @mentions and media", async () => {
    const file = new File(["(⌐□_□)"], "cool.png", { type: "image/png" });
    global.URL.createObjectURL = jest.fn(() => "blob:mock");

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "1",
            city: "",
            business_account: 0,
          },
        }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 99 }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ subforumId: 5 }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<CreatePost />);
    await screen.findByText("New Post");

    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Hey @john check this out" },
    });

    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    await waitFor(() =>
      expect(global.fetch as jest.Mock).toHaveBeenCalledWith(
        expect.stringContaining("/send/callout/notification"),
        expect.any(Object)
      )
    );
  });

  test("submits business post successfully", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "bizuser",
            user_id: "1",
            city: "",
            business_account: 1,
          },
        }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 200 }) });

    render(<CreatePost />);
    await screen.findByText("New Post");

    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "From business!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith("/dashboard/fundraiser")
    );
  });

  test("handles unexpected error during submit", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "1",
            city: "",
            business_account: 0,
          },
        }),
      })
      .mockRejectedValueOnce(new Error("Network failure"));

    render(<CreatePost />);
    await screen.findByText("New Post");

    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Fail case" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() => {
      expect(screen.getByText("Network failure")).toBeInTheDocument();
    });
  });

  test("shows error if business post is empty", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "bizuser",
            user_id: "1",
            city: "",
            business_account: 1,
          },
        }),
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Some content" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() => {
      expect(screen.getByText("Post cannot be empty.")).toBeInTheDocument();
    });
  });

  test("handles adding and removing media files", async () => {
    const file = new File(["mock content"], "test.png", { type: "image/png" });
    global.URL.createObjectURL = jest.fn(() => "blob:preview.png");

    global.URL.revokeObjectURL = jest.fn();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "123",
            city: "General",
            business_account: 0,
          },
        }),
      });

    const { container } = render(<CreatePost />);
    await screen.findByText("New Post");

    const input = container.querySelector("input[type='file']")!;
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByAltText("Media 1")).toBeInTheDocument();

    const removeButton = container.querySelector("button");
    fireEvent.click(removeButton!);

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview.png");
  });

  test("clicking 'Add Media' triggers file input", async () => {
    const clickSpy = jest.fn();
    const originalClick = HTMLInputElement.prototype.click;
    HTMLInputElement.prototype.click = clickSpy;

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "1",
            city: "",
            business_account: 0,
          },
        }),
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    const addMediaBtn = screen.getByRole("button", { name: /Add Media/i });
    fireEvent.click(addMediaBtn);

    expect(clickSpy).toHaveBeenCalled();
    HTMLInputElement.prototype.click = originalClick;
  });

  test("sends media data to backend when firebaseURLs update", async () => {
    const file = new File(["media"], "img.png", { type: "image/png" });
    global.URL.createObjectURL = jest.fn(() => "blob:fake");

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "123",
            city: "General",
            business_account: 0,
          },
        }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 999 }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ subforumId: 1 }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    const { container } = render(<CreatePost />);
    await screen.findByText("New Post");

    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Test post with media" },
    });

    const input = container.querySelector("input[type='file']")!;
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/post/media"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  test("does not crash when fileInputRef is null", async () => {
    const originalCreateRef = React.useRef;
    jest.spyOn(React, "useRef").mockReturnValueOnce({ current: null });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "1",
            city: "",
            business_account: 0,
          },
        }),
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    const addMediaBtn = screen.getByRole("button", { name: /Add Media/i });
    fireEvent.click(addMediaBtn); // should do nothing silently
  });

  test("shows error if user is not authenticated", async () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);
    render(<CreatePost />);
    await waitFor(() => {
      expect(
        screen.getByText("User is not authenticated.")
      ).toBeInTheDocument();
    });
  });
});
