import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Forum from "@/app/ui/forum";

// Mocks
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: () => [{ uid: "abc123" }],
}));
jest.mock("@/app/firebase/config", () => ({
  auth: {},
}));

jest.mock("@/app/ui/post", () => (props: any) => {
  // Simulate invoking callbacks
  props.onUpdateContent?.("Updated content!");
  props.onDeleteContent?.();

  return (
    <div data-testid="post" data-user={props.username} data-body={props.body}>
      {props.body}
    </div>
  );
});

jest.mock("@/app/ui/searchbar", () => (props: any) => (
  <input
    data-testid="search"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    placeholder={props.placeholder}
  />
));

describe("Forum", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders posts returned from backend", async () => {
    const mockResponse = {
      posts: [
        {
          user_id: "abc123",
          post_date: "2024-01-01",
          last_edit_date: "2024-01-02",
          body: "Hello World!",
          content_id: "1",
        },
      ],
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          posts: [
            {
              user_id: "abc123",
              post_date: "2024-01-01",
              last_edit_date: "2024-01-02",
              body: "Hello World!",
              content_id: "1",
            },
          ],
        }),
      }) // fetchPosts
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: "TestUser" }),
      }); // getUser
  });

  it("filters posts by search", async () => {
    const mockResponse = {
      posts: [
        {
          user_id: "abc123",
          post_date: "2024-01-01",
          last_edit_date: "2024-01-02",
          body: "Searchable Body",
          content_id: "1",
        },
      ],
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockResponse }) // fetchPosts
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: "FilteredUser" }),
      }) // getUser
      .mockResolvedValueOnce({ ok: true, json: async () => mockResponse }) // fetchPosts after search
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: "FilteredUser" }),
      }); // getUser again

    render(<Forum />);

    // Initial post load
    await screen.findByTestId("post");

    // Trigger search filter
    fireEvent.change(screen.getByTestId("search"), {
      target: { value: "asdf" },
    });

    // Post should be filtered out
    await waitFor(() => {
      expect(screen.queryByTestId("post")).not.toBeInTheDocument();
    });
  });

  it("handles backend error gracefully", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false });

    const { container } = render(<Forum />);

    await waitFor(() => {
      expect(container.textContent).toContain("No posts available");
    });
  });

  it("falls back to default username if getUser fails", async () => {
    const mockResponse = {
      posts: [
        {
          user_id: "abc123",
          post_date: "2024-01-01",
          last_edit_date: "2024-01-02",
          body: "Fallback user test",
          content_id: "2",
        },
      ],
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockResponse }) // ✅ fetchPosts
      .mockResolvedValueOnce({ ok: false }); // ✅ getUser fails

    render(<Forum />);

    const post = await screen.findByTestId("post");
    expect(post).toHaveTextContent("Fallback user test");
  });
  it("fetches posts from userPosts endpoint when userID is provided", async () => {
    const mockResponse = {
      posts: [
        {
          user_id: "abc123",
          post_date: "2024-02-01",
          last_edit_date: "2024-02-02",
          body: "User-specific post",
          content_id: "10",
        },
      ],
    };

    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockResponse }) // fetchPosts for userID
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ username: "TargetUser" }),
      }); // getUser

    global.fetch = fetchMock;

    render(<Forum userID="42" />); // ✅ This triggers the conditional

    const post = await screen.findByTestId("post");
    expect(post).toHaveTextContent("User-specific post");

    // Optional: assert correct endpoint was used
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/userPosts/42"),
      expect.any(Object)
    );
  });
});
