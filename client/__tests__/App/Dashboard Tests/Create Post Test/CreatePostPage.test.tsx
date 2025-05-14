import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePost from "@/app/dashboard/createpost/page";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("react-firebase-hooks/auth", () => ({ useAuthState: jest.fn() }));
jest.mock("@/app/firebase/config", () => ({ auth: {} }));
jest.mock("@heroui/react", () => ({
  Button: ({ children, onPress, disabled }: any) => (
    <button onClick={disabled ? undefined : onPress} disabled={disabled}>
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
  test("shows error if user is not authenticated", async () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false, null]);
    render(<CreatePost />);
    await waitFor(() => {
      expect(
        screen.getByText("User is not authenticated.")
      ).toBeInTheDocument();
    });
  });
  test("handles failed user fetch", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "User profile not found" }),
      });
    render(<CreatePost />);
    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch user data.")
      ).toBeInTheDocument();
    });
  });

  test("handles failed user fetch with no specific error message", async () => {
    // Mock fetch to return a failed response WITH NO ERROR PROPERTY
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}), // No error property, forcing the fallback message
      });

    render(<CreatePost />);

    // Wait for the error message to appear - this verifies the fallback message was used
    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch user data.")
      ).toBeInTheDocument();
    });
  });

  test("handles failed user fetch with specific error message", async () => {
    // Mock fetch to return a failed response WITH a specific error message
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Custom API error" }), // Specific error property
      });

    render(<CreatePost />);

    // The component still shows the generic message because of the catch block
    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch user data.")
      ).toBeInTheDocument();
    });
  });

  test("shows error if personal userData is missing username", async () => {
    // Setup: valid subforum fetch, but mock user data missing username
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) }) // subforums
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "",
            user_id: "123",
            city: "General",
            business_account: 0,
          },
        }),
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Simulate user typing valid post
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Hello world" },
    });

    // Simulate clicking post button
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    await waitFor(() =>
      expect(
        screen.getByText("User data is incomplete. Please try again.")
      ).toBeInTheDocument()
    );
  });

  test("shows error if business account userData is missing username", async () => {
    // Setup: valid subforum fetch, but mock business user data missing username
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "", // Empty username should trigger the validation error
            user_id: "456",
            city: "",
            business_account: 1, // This is key - it needs to be a business account
          },
        }),
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Enter valid post content
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Business post with missing username" },
    });

    // Click the post button
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    // Verify the error message
    await waitFor(() => {
      expect(
        screen.getByText("User data is incomplete. Please try again.")
      ).toBeInTheDocument();
    });
  });

  test("handles cancel for business account", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) }) // subforums
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

    // Wait for the form title to appear
    await screen.findByText("New Post");

    // Wait for business logic to load
    await waitFor(() => {
      const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
      expect(cancelBtn).toBeInTheDocument();
    });

    // Now cancel triggers the business route
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

  test("submits business post with media successfully", async () => {
    // Create a mock image file
    const file = new File(["business image content"], "business-image.png", {
      type: "image/png",
    });
    global.URL.createObjectURL = jest.fn(() => "blob:business-image");

    // Mock Firebase storage functions
    const { getStorage, ref, uploadBytes, getDownloadURL } =
      jest.requireMock("firebase/storage");

    // Mock fetch responses for the business post flow with media
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "businessuser",
            user_id: "456",
            city: "",
            business_account: 1, // This is a business account
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 500 }), // Post creation response
      });

    const { container } = render(<CreatePost />);
    await screen.findByText("New Post");

    // Add content to the post
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Business post with media" },
    });

    // Add a media file
    const input = container.querySelector("input[type='file']")!;
    fireEvent.change(input, { target: { files: [file] } });

    // Verify media preview is shown
    await waitFor(() => {
      expect(screen.getByAltText("Media 1")).toBeInTheDocument();
    });

    // Submit the post
    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    // Verify Firebase storage operations were called
    await waitFor(() => {
      // Check if ref was called
      expect(ref).toHaveBeenCalled();

      // Check if uploadBytes was called
      expect(uploadBytes).toHaveBeenCalled();

      // Check if getDownloadURL was called
      expect(getDownloadURL).toHaveBeenCalled();

      // Check that we were redirected to the fundraiser page
      expect(mockPush).toHaveBeenCalledWith("/dashboard/fundraiser");
    });
  });
  test("handles personal post submission failure with no error message", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "123",
            city: "General",
            business_account: 0, // Personal account
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}), // No error property will trigger the fallback message
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Type a post
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "This post will fail to submit" },
    });

    // Click the Post button
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    // Verify the fallback error message is displayed
    await waitFor(() => {
      expect(screen.getByText("Failed to submit post.")).toBeInTheDocument();
    });
  });

  test("handles personal post submission failure with specific error message", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "123",
            city: "General",
            business_account: 0, // Personal account
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Server rejected post content" }), // Specific error message
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Type a post
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "This post will fail with specific error" },
    });

    // Click the Post button
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    // Verify the specific error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("Server rejected post content")
      ).toBeInTheDocument();
    });
  });
  test("handles personal post submission with generic error (no message)", async () => {
    // Mock fetch responses:
    // 1. Successful subforum fetch
    // 2. Successful user data fetch
    // 3. Failed post submission causing a generic error
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "testuser",
            user_id: "123",
            city: "General",
            business_account: 0, // Personal account
          },
        }),
      })
      .mockRejectedValueOnce({}); // Plain error object with no message property

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Type a post
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "This post will trigger a generic error" },
    });

    // Click the Post button
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    // Verify the fallback error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("An unexpected error occurred.")
      ).toBeInTheDocument();
    });
  });
  test("handles server error when submitting a personal post", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rows: [{ subforum_id: 1, name: "General" }] }),
      })
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
        // This is the key part - simulate a failed post request
        ok: false,
        json: async () => ({ error: "Server rejected post" }),
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Enter valid post content to enable the button
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "This post will fail on the server" },
    });

    // Click the Post button to submit
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    // Verify the error message from the server is displayed
    await waitFor(() => {
      expect(screen.getByText("Server rejected post")).toBeInTheDocument();
    });
  });

  test("handles server error when submitting a business post", async () => {
    // Mock fetch responses:
    // 1. Subforum fetch success
    // 2. User data fetch success with business account
    // 3. Post submission failure with error message
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rows: [{ subforum_id: 1, name: "General" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "businessuser",
            user_id: "789",
            city: "",
            business_account: 1, // Set as business account
          },
        }),
      })
      .mockResolvedValueOnce({
        // This is the key part - simulate a failed post request for business
        ok: false,
        json: async () => ({ error: "Business post rejected" }),
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Enter valid post content to enable the button
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "This business post will fail on the server" },
    });

    // Click the Post button to submit
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    // Verify the error message from the server is displayed
    await waitFor(() => {
      expect(screen.getByText("Business post rejected")).toBeInTheDocument();
    });
  });
  test("handles business post submission failure with no error message", async () => {
    // Mock fetch responses:
    // 1. Successful subforum fetch
    // 2. Successful user data fetch with business account
    // 3. Failed post submission with no specific error message
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "businessuser",
            user_id: "123",
            city: "General",
            business_account: 1, // Business account
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}), // No error property will trigger the fallback message
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Type a post
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Business post that will fail" },
    });

    // Click the Post button
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    // Verify the fallback error message is displayed
    await waitFor(() => {
      expect(screen.getByText("Failed to submit post.")).toBeInTheDocument();
    });
  });

  test("handles business post submission failure with specific error message", async () => {
    // Mock fetch responses:
    // 1. Successful subforum fetch
    // 2. Successful user data fetch with business account
    // 3. Failed post submission with a specific error message
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "businessuser",
            user_id: "123",
            city: "General",
            business_account: 1, // Business account
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: "Business posts are currently restricted",
        }), // Specific error
      });

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Type a post
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Business post with specific error" },
    });

    // Click the Post button
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    // Verify the specific error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("Business posts are currently restricted")
      ).toBeInTheDocument();
    });
  });
  test("handles business post submission with generic error (no message)", async () => {
    // Mock fetch responses:
    // 1. Successful subforum fetch
    // 2. Successful user data fetch with business account
    // 3. Failed post submission causing a generic error
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rows: [] }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "businessuser",
            user_id: "123",
            city: "General",
            business_account: 1, // Business account
          },
        }),
      })
      .mockRejectedValueOnce({}); // Plain error object with no message property

    render(<CreatePost />);
    await screen.findByText("New Post");

    // Type a post
    fireEvent.change(screen.getByPlaceholderText("Write your post here"), {
      target: { value: "Business post that will cause a generic error" },
    });

    // Click the Post button
    const postBtn = screen.getByRole("button", { name: /Post/i });
    fireEvent.click(postBtn);

    // Verify the fallback error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("An unexpected error occurred.")
      ).toBeInTheDocument();
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
  test("clicking Add Media button and having no files selected works correctly", async () => {
    // Mock fetch responses
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

    // Mock URL.createObjectURL since it's not implemented in jsdom
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => "blob:mock-url");

    // Render the component
    render(<CreatePost />);
    await screen.findByText("New Post");

    // Find and click the "Add Media" button
    const addMediaBtn = screen.getByText(/Add Media/i);
    fireEvent.click(addMediaBtn);

    // Mock a click on file input that results in no files selected
    // This will internally call handleFileChange with e.target.files = null
    // Note: We don't actually trigger a change event because we're simulating
    // the user clicking "Cancel" in the file dialog

    // Verify the component still renders correctly
    expect(screen.getByText("New Post")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write your post here")
    ).toBeInTheDocument();
    expect(screen.queryByText("Attached Media")).not.toBeInTheDocument();

    // Clean up mock
    URL.createObjectURL = originalCreateObjectURL;
  });

  test("handleFileChange with invalid file types shows error and returns early", async () => {
    // Mock fetch responses
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

    // Create a file with invalid type to trigger the error path
    const invalidFile = new File(["content"], "test.xyz", {
      type: "application/xyz",
    });

    const { container } = render(<CreatePost />);
    await screen.findByText("New Post");

    // Find the file input
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeNull();

    // Add an invalid file
    fireEvent.change(input!, { target: { files: [invalidFile] } });

    // Error message should be displayed
    await waitFor(() => {
      expect(
        screen.getByText(`Invalid file type: ${invalidFile.name}`)
      ).toBeInTheDocument();
    });

    // No media preview should be shown (returned early)
    expect(screen.queryByText("Attached Media")).not.toBeInTheDocument();
  });
  test("shows error message when invalid file type is uploaded", async () => {
    // Mock fetch responses
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

    // Create a file with an invalid type
    const invalidFile = new File(["invalid content"], "document.pdf", {
      type: "application/pdf", // This is not in the validTypes array
    });

    const { container } = render(<CreatePost />);
    await screen.findByText("New Post");

    // Find the file input
    const input = container.querySelector("input[type='file']")!;

    // Trigger file change with the invalid file
    fireEvent.change(input, { target: { files: [invalidFile] } });

    // Check if the error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("Invalid file type: document.pdf")
      ).toBeInTheDocument();
    });

    // Verify that the media preview section is not shown (file was rejected)
    expect(screen.queryByText("Attached Media")).not.toBeInTheDocument();
  });
  test("handles non-image file uploads correctly", async () => {
    // Mock fetch responses
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

    // Create a video file (one of the valid non-image types)
    const videoFile = new File(["video content"], "test-video.mp4", {
      type: "video/mp4", // This is a valid type that will trigger the non-image path
    });

    const { container } = render(<CreatePost />);
    await screen.findByText("New Post");

    // Find the file input
    const input = container.querySelector("input[type='file']")!;

    // Trigger file change with the video file
    fireEvent.change(input, { target: { files: [videoFile] } });

    // Wait for the media preview to be added
    await waitFor(() => {
      expect(screen.getByText("Attached Media")).toBeInTheDocument();
    });

    // For non-image files, we should see the file type displayed
    expect(screen.getByText("MP4")).toBeInTheDocument();
  });
});
