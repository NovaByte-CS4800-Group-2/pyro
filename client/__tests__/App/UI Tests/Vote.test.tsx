import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Vote from "@/app/ui/vote";

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("Vote", () => {
  const baseProps = {
    contentId: 1,
    userId: "user123",
    username: "hadya",
  };

  it("displays message if no userId provided", () => {
    render(<Vote {...baseProps} userId="" />);
    expect(
      screen.getByText("Please log in/register to interact with post.")
    ).toBeInTheDocument();
  });

  it("fetches and displays initial vote state", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ totalVotes: 5 }),
      }) // total votes
      .mockResolvedValueOnce({
        json: async () => ({ vote: 1 }),
      }); // user vote

    render(<Vote {...baseProps} />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  it("allows upvoting if not voted yet", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: async () => ({ totalVotes: 0 }) }) // total
      .mockResolvedValueOnce({ json: async () => ({ vote: null }) }) // user vote
      .mockResolvedValue({ ok: true }); // vote + notif

    const { container } = render(
      <Vote contentId={1} userId="user123" username="hadya" />
    );

    await screen.findByText("0");

    // Select the first SVG icon (upvote)
    const icons = container.querySelectorAll("svg");
    const upvoteIcon = icons[0];

    fireEvent.click(upvoteIcon);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/vote"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("removes existing vote on same click", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: async () => ({ totalVotes: 1 }) }) // total
      .mockResolvedValueOnce({ json: async () => ({ vote: 1 }) }) // user upvoted
      .mockResolvedValue({ ok: true }); // for vote removal requests

    const { container } = render(
      <Vote contentId={1} userId="user123" username="hadya" />
    );

    await screen.findByText("1");

    const icons = container.querySelectorAll("svg");
    const upvoteIcon = icons[0];
    fireEvent.click(upvoteIcon);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/remove/vote"),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  it("prevents voting on shared posts", async () => {
    const { container } = render(
      <Vote
        contentId={1}
        userId="user123"
        username="hadya"
        isSharedPost={true}
      />
    );

    // Find the disabled vote container
    const voteContainer = container.querySelector(
      ".pointer-events-none"
    );

    expect(voteContainer).toBeInTheDocument();
    expect(voteContainer).toHaveClass("opacity-40");
  });

  it("handles fetch failure silently", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("fail"));

    render(<Vote {...baseProps} />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
