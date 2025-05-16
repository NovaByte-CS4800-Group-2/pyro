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

  it("does not fetch user data if user is not authenticated", async () => {
    // mock unauthenticated state
    (useAuthState as jest.Mock).mockReturnValue([null]);

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    render(<Comments contentId={1} />);

    // wait for useEffect to run
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "User is not authenticated:",
        null
      );
    });

    consoleSpy.mockRestore();
  });

  it("handles failed user data fetch with error logging", async () => {
    const mockError = { error: "User not found" };

    (useAuthState as jest.Mock).mockReturnValue([
      { uid: "123", displayName: "ghost" },
    ]);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Comments contentId={1} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user data:",
        mockError
      );
    });

    consoleSpy.mockRestore();
  });

  it("handles failed comment fetch with error logging", async () => {
    (useAuthState as jest.Mock).mockReturnValue([
      { uid: "user123", displayName: "hadya" },
    ]);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: { username: "hadya", city: "General", business_account: 0 },
        }),
      }) // for user profile
      .mockResolvedValueOnce({ ok: false, status: 500 }); // FAIL comments fetch

    render(<Comments contentId={1} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch comments:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("handles failed username fetch during comments rendering", async () => {
    const mockComments = [
      {
        content_id: 1,
        user_id: "u1",
        body: "Oops user",
        post_date: "2024-01-01",
      },
    ];

    (useAuthState as jest.Mock).mockReturnValue([
      { uid: "user123", displayName: "hadya" },
    ]);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ profile: {} }) }) // user profile
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: mockComments }),
      }) // comments
      .mockResolvedValueOnce({ ok: false, status: 404 }); // username fetch fails

    render(<Comments contentId={1} />);

    await screen.findByText("User: Oops user"); // fallback to default username

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching username for comment 1:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("prevents posting an empty comment and logs an error", async () => {
    (useAuthState as jest.Mock).mockReturnValue([
      { uid: "user123", displayName: "hadya" },
    ]);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "hadya",
            city: "General",
            business_account: 0,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [] }),
      });

    render(<Comments contentId={1} />);

    await screen.findByPlaceholderText("Leave a comment...");

    const form = document.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Comment cannot be empty or user is not logged in"
      );
    });

    consoleSpy.mockRestore();
  });
  it("logs an error if posting a comment fails", async () => {
    (useAuthState as jest.Mock).mockReturnValue([
      { uid: "user123", displayName: "hadya" },
    ]);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "hadya",
            city: "General",
            business_account: 0,
          },
        }),
      }) // user profile
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [] }),
      }) // comments
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}), // required to prevent TypeError
        text: async () => "backend broke",
      }); // failed createComment

    render(<Comments contentId={1} subforumId="General" />);

    await screen.findByPlaceholderText("Leave a comment...");

    fireEvent.change(screen.getByPlaceholderText("Leave a comment..."), {
      target: { value: "error here" },
    });

    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to post comment:",
        "backend broke"
      );
    });

    consoleSpy.mockRestore();
  });

  it("catches and logs error if fetch throws during comment post", async () => {
    (useAuthState as jest.Mock).mockReturnValue([
      { uid: "user123", displayName: "hadya" },
    ]);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "hadya",
            city: "General",
            business_account: 0,
          },
        }),
      }) // fetch user data
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [] }),
      }) // fetch comments
      .mockImplementationOnce(() => {
        throw new Error("fetch exploded");
      }); // force error during createComment

    render(<Comments contentId={1} subforumId="General" />);

    await screen.findByPlaceholderText("Leave a comment...");

    fireEvent.change(screen.getByPlaceholderText("Leave a comment..."), {
      target: { value: "causes fetch crash" },
    });

    fireEvent.submit(document.querySelector("form")!);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to post comment:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("renders exact value from Math.min for Show N comments", async () => {
    const mockComments = Array.from({ length: 5 }, (_, i) => ({
      content_id: i,
      user_id: `u${i}`,
      body: `Comment ${i}`,
      post_date: "2024-01-01",
    }));

    (useAuthState as jest.Mock).mockReturnValue([
      { uid: "user123", displayName: "hadya" },
    ]);

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            username: "hadya",
            city: "Test",
            business_account: 0,
          },
        }),
      }) // user profile
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: mockComments }),
      })
      .mockImplementation(() =>
        Promise.resolve({ ok: true, json: async () => ({ username: "user" }) })
      );

    render(<Comments contentId={1} />);

    // The key here is matching the inner text **exactly**
    const showMoreBtn = await screen.findByRole("button", {
      name: /Show 3 comments/,
    });

    expect(showMoreBtn.textContent).toMatch("Show 3 comments");

    // Click to walk the whole branch
    fireEvent.click(showMoreBtn);
    await screen.findByText("user: Comment 4");
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
