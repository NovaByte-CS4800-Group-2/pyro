import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Notifications from "@/app/ui/notifications";

// Mock fetch
const fetchMock = jest.fn();
global.fetch = fetchMock as any;

beforeEach(() => {
  jest.clearAllMocks();
});

// Mock Date formatting
const mockDate = new Date("2024-01-01T00:00:00Z");
jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);

describe("Notifications", () => {
  const userId = "abc123";
  const username = "hadya";

  it("renders loading state initially", () => {
    fetchMock.mockReturnValueOnce(
      Promise.resolve({ ok: true, json: async () => ({ notifications: [] }) })
    );

    render(<Notifications userId={userId} username={username} />);
    expect(screen.getByText("Loading notifications...")).toBeInTheDocument();
  });

  it("renders all notification types and handles delete", async () => {
    fetchMock
      // get/notifications
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          notifications: [
            { content_id: 1, type: "vote", date: "2024-01-01", read: false, username: "user1" },
            { content_id: 2, type: "comment", date: "2024-01-01", read: false, username: "user2" },
            { content_id: 3, type: "matching", date: "2024-01-01", read: false, username: "user3" },
            { content_id: 4, type: "callout", date: "2024-01-01", read: false, username: "user4" },
            { content_id: 5, type: "reply", date: "2024-01-01", read: false, username: "user5" },
          ],
        }),
      })
      // mark as read
      .mockResolvedValueOnce({ ok: true })
      // get/notification/content
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          notifications: [
            { content_id: 1, body: "Upvoted comment", vote: 1 },
            { content_id: 2, body: "Nice one @hadya", post: "Original post" },
            { content_id: 3, body: "You're matched" },
            { content_id: 4, body: "Hello @hadya from user4" },
            { content_id: 5, body: "Generic reply" },
          ],
        }),
      });

    render(<Notifications userId={userId} username={username} />);

    // Wait for everything to load
    await waitFor(() => {
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    });

    // Confirm mentions are highlighted
    expect(screen.getAllByText("@hadya")[0]).toHaveClass("text-[--deep-terracotta]");

    // Delete a notification
    const closeButtons = screen.getAllByRole("button", { name: "Delete notification" });
    fireEvent.click(closeButtons[0]);

    await waitFor(() => {
      expect(closeButtons[0]).not.toBeInTheDocument();
    });
  });

  it("handles fetch errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    fetchMock.mockRejectedValueOnce(new Error("API failure"));

    render(<Notifications userId={userId} username={username} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching notifications:", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("shows fallback when no notifications", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ notifications: [] }),
      })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ notifications: [] }),
      });

    render(<Notifications userId={userId} username={username} />);

    await waitFor(() => {
      expect(screen.getByText("No notifications")).toBeInTheDocument();
    });
  });
});
