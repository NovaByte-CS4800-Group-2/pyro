import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Comments from "@/app/ui/comments";
import { useAuthState } from "react-firebase-hooks/auth";

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));
jest.mock("@/app/firebase/config", () => ({ auth: {} }));

jest.mock("@/app/ui/content", () => (props: any) => (
  <div data-testid="comment">
    {props.username}: {props.body}
  </div>
));
jest.mock("@heroui/react", () => ({
  Button: ({ children, onClick, onPress, ...rest }: any) => (
    <button onClick={onClick || onPress} {...rest}>
      {children}
    </button>
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  (useAuthState as jest.Mock).mockReturnValue([
    { uid: "user123", displayName: "hadya" },
  ]);
});

describe("Comments", () => {
  it("shows loading state", () => {
    render(<Comments contentId={1} />);
    expect(screen.getByText("Loading comments...")).toBeInTheDocument();
  });

  it("shows no comments fallback", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ profile: {} }) }) // user profile
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [] }),
      });

    render(<Comments contentId={1} />);

    await screen.findByText("No comments yet.");
  });

  it("renders limited visible comments", async () => {
    const mockComments = Array.from({ length: 5 }, (_, i) => ({
      content_id: i,
      user_id: "u" + i,
      body: `comment ${i}`,
      post_date: "2024-01-01",
    }));

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ profile: {} }) }) // user profile
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: mockComments }),
      })
      .mockImplementation(() =>
        Promise.resolve({ ok: true, json: async () => ({ username: "user" }) })
      );

    render(<Comments contentId={1} />);

    await screen.findByText("user: comment 0");
    expect(screen.queryByText("user: comment 2")).not.toBeInTheDocument();
  });

  it("expands and collapses comments", async () => {
    const mockComments = Array.from({ length: 5 }, (_, i) => ({
      content_id: i,
      user_id: "u" + i,
      body: `comment ${i}`,
      post_date: "2024-01-01",
    }));

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ profile: {} }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: mockComments }),
      })
      .mockImplementation(() =>
        Promise.resolve({ ok: true, json: async () => ({ username: "user" }) })
      );

    render(<Comments contentId={1} />);
    await screen.findByText("user: comment 0");

    const showMoreBtn = await screen.findByText(/Show 3 comments/i);
    fireEvent.click(showMoreBtn);

    await screen.findByText("user: comment 4");

    const showLessBtn = await screen.findByText(/Show less/i);
    fireEvent.click(showLessBtn);

    expect(screen.queryByText("user: comment 4")).not.toBeInTheDocument();
  });

  it("posts a comment with @mentions and triggers fetch", async () => {
    const mockProfile = {
      profile: {
        username: "hadya",
        city: "General",
        business_account: 0,
      },
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockProfile }) // fetchUserData
      .mockResolvedValueOnce({ ok: true, json: async () => ({ comments: [] }) }) // initial comments
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 10 }) }) // createComment
      .mockResolvedValueOnce({ ok: true }) // send comment notif
      .mockResolvedValueOnce({ ok: true }); // send callout notif

    render(<Comments contentId={1} subforumId="General" />);

    await screen.findByText("No comments yet.");

    fireEvent.change(screen.getByPlaceholderText("Leave a comment..."), {
      target: { value: "Hello @john!" },
    });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/send/callout/notification"),
        expect.any(Object)
      );
    });
  });

  it("handles user fetch failure gracefully", async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error("fail")) // profile fetch fails
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [] }),
      });

    render(<Comments contentId={1} />);
    await screen.findByText("No comments yet.");
  });

  it("renders user comments instead of post if no contentId", async () => {
    const comment = {
      content_id: 1,
      user_id: "u1",
      body: "User comment",
      post_date: "2024-01-01",
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ profile: {} }) }) // profile
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [comment] }),
      }) // comments
      .mockResolvedValue({
        ok: true,
        json: async () => ({ username: "User" }),
      });

    render(<Comments user_id="u1" />);
    await screen.findByText("User: User comment");
  });
});
