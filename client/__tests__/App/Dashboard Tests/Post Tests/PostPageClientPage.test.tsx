import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import PostClientPage from "@/app/dashboard/post/[content_id]/postClientPage";
import { useAuthState } from "react-firebase-hooks/auth";

// Mocks
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));
jest.mock("@/app/firebase/config", () => ({
  auth: {},
}));
jest.mock("@/app/ui/post", () => (props: any) => (
  <div data-testid="post-component">{JSON.stringify(props)}</div>
));

const mockedUseAuthState = useAuthState as jest.Mock;

describe("PostClientPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    mockedUseAuthState.mockReturnValue([{}]);

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ post: null }),
      ok: true,
    }) as jest.Mock;

    await act(async () => {
      render(<PostClientPage contentID="1" />);
    });

    expect(screen.getByText("Loading post...")).toBeInTheDocument();
  });

  it("renders post when fetched successfully", async () => {
    mockedUseAuthState.mockReturnValue([{ displayName: "Alice" }]);

    const postData = {
      user_id: "u1",
      post_date: "2024-01-01",
      last_edit_date: "2024-01-02",
      body: "Sample post body",
      id: "123",
      username: "Alice",
      is_verified: true,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ post: postData }),
      ok: true,
    }) as jest.Mock;

    await act(async () => {
      render(<PostClientPage contentID="123" />);
    });

    await waitFor(() => screen.getByTestId("post-component"));

    const postComponent = screen.getByTestId("post-component");
    expect(postComponent).toHaveTextContent("Sample post body");
    expect(postComponent).toHaveTextContent('"isOwner":true');
  });

  it("sets isOwner to false when user is null", async () => {
    mockedUseAuthState.mockReturnValue([null]); // user is null

    const postData = {
      user_id: "u404",
      post_date: "2024-01-01",
      body: "No user fallback test",
      id: "404",
      username: "NoUserPoster",
      is_verified: false,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ post: postData }),
      ok: true,
    }) as jest.Mock;

    await act(async () => {
      render(<PostClientPage contentID="404" />);
    });

    const postComponent = await screen.findByTestId("post-component");
    expect(postComponent).toHaveTextContent('"isOwner":false');
  });

  it("falls back to 'null' for missing last_edit_date", async () => {
    mockedUseAuthState.mockReturnValue([{ displayName: "Alice" }]);

    const postData = {
      user_id: "u3",
      post_date: "2024-01-01",
      body: "Missing edited date",
      id: "789",
      username: "Alice",
      is_verified: true,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ post: postData }),
      ok: true,
    }) as jest.Mock;

    await act(async () => {
      render(<PostClientPage contentID="789" />);
    });

    const postComponent = await screen.findByTestId("post-component");
    expect(postComponent).toHaveTextContent('"editeddate":"null"');
  });

  it("logs error if fetch fails", async () => {
    mockedUseAuthState.mockReturnValue([{}]);

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Fetch error"));

    await act(async () => {
      render(<PostClientPage contentID="999" />);
    });

    expect(consoleError).toHaveBeenCalledWith(
      "❌ Failed to fetch post:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });
});
