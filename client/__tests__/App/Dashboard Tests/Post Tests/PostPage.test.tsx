import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import SharedPostPage from "@/app/dashboard/post/[content_id]/page";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

// Mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));
jest.mock("@/app/firebase/config", () => ({
  auth: {},
}));
jest.mock(
  "@/app/dashboard/post/[content_id]/postWrapper",
  () => (props: any) =>
    (
      <div data-testid="post-wrapper">
        PostWrapper: {JSON.stringify(props.post)}
      </div>
    )
);

const mockPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  (useAuthState as jest.Mock).mockReturnValue([{}]);
});

describe("SharedPostPage", () => {
  const setup = (params: any) => {
    render(<SharedPostPage params={params} />);
  };

  it("renders loading state initially", async () => {
    let resolveParams: any;
    const params = new Promise((resolve) => {
      resolveParams = resolve;
    });

    await act(async () => {
      setup(params);
    });

    // It should immediately show the loading state before param resolution
    expect(screen.getByText("Loading shared post...")).toBeInTheDocument();

    await act(async () => {
      resolveParams({ content_id: "123" });
    });
  });

  it("renders post not found if post is missing", async () => {
    const params = Promise.resolve({ content_id: "notfound" });

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ post: null }),
      ok: true,
    }) as jest.Mock;

    await act(async () => {
      setup(params);
    });

    await waitFor(() =>
      expect(screen.getByText("Post not found.")).toBeInTheDocument()
    );

    // Click 'Go back' button
    act(() => {
      screen.getByText("Go back to Dashboard").click();
    });
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("renders fetched post", async () => {
    const fakePost = {
      user_id: "u123",
      post_date: "2024-01-01",
      last_edit_date: "2024-01-02",
      body: "Test post body",
      content_id: "456",
      is_verified: true,
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ post: fakePost }),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: async () => ({ username: "TestUser" }),
        ok: true,
      }) as jest.Mock;

    await act(async () => {
      setup(Promise.resolve({ content_id: "456" }));
    });

    await waitFor(() => screen.getByTestId("post-wrapper"));

    expect(screen.getByText("← Back to Dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("post-wrapper")).toHaveTextContent(
      "Test post body"
    );
  });

  it("handles error during username fetch gracefully", async () => {
    const fakePost = {
      user_id: "u456",
      post_date: "2024-01-01",
      last_edit_date: "2024-01-02",
      body: "Body with failed username",
      content_id: "789",
      is_verified: true,
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ post: fakePost }),
        ok: true,
      })
      .mockRejectedValueOnce(
        new Error("Failed to fetch username")
      ) as jest.Mock;

    await act(async () => {
      setup(Promise.resolve({ content_id: "789" }));
    });

    await waitFor(() => screen.getByTestId("post-wrapper"));

    expect(screen.getByTestId("post-wrapper")).toHaveTextContent(
      "Body with failed username"
    );
  });

  it("falls back to default username when backend returns null username", async () => {
    const fakePost = {
      user_id: "u789",
      post_date: "2024-02-01",
      last_edit_date: "2024-02-02",
      body: "Fallback username post",
      content_id: "999",
      is_verified: true,
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ post: fakePost }),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: async () => ({ username: null }),
        ok: true,
      }) as jest.Mock;

    await act(async () => {
      render(
        <SharedPostPage params={Promise.resolve({ content_id: "999" })} />
      );
    });

    await waitFor(() => {
      const wrapper = screen.getByTestId("post-wrapper");
      expect(wrapper).toHaveTextContent("Fallback username post");
      expect(wrapper).toHaveTextContent('"username":"User"');
    });
  });

  it("falls back to 'null' when last_edit_date is missing", async () => {
    const fakePost = {
      user_id: "u111",
      post_date: "2024-04-01",
      // last_edit_date is intentionally missing
      body: "Post with no edited date",
      content_id: "111",
      is_verified: false,
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ post: fakePost }),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: async () => ({ username: "NoEditUser" }),
        ok: true,
      }) as jest.Mock;

    await act(async () => {
      render(
        <SharedPostPage params={Promise.resolve({ content_id: "111" })} />
      );
    });

    await waitFor(() => {
      const wrapper = screen.getByTestId("post-wrapper");
      expect(wrapper).toHaveTextContent("Post with no edited date");
      expect(wrapper).toHaveTextContent('"editeddate":"null"');
    });
  });

  it("logs error if params content_id is missing", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await act(async () => {
      setup(Promise.resolve({}));
    });
    expect(consoleError).toHaveBeenCalledWith(
      "❌ No content_id found in resolved params!"
    );
    consoleError.mockRestore();
  });

  it("logs fetch error", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Fetch failed"));

    await act(async () => {
      setup(Promise.resolve({ content_id: "500" }));
    });

    await waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        "❌ Failed to fetch post:",
        expect.any(Error)
      )
    );

    consoleError.mockRestore();
  });
});
