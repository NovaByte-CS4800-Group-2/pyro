import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Profile from "@/app/dashboard/profile/[user_id]/page";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock("@/app/firebase/config", () => ({
  app: {},
}));

jest.mock("@/app/ui/comments", () => (props: any) => (
  <div data-testid="comments">Comments for {props.user_id}</div>
));
jest.mock("@/app/ui/forum", () => (props: any) => (
  <div data-testid="forum">Forum for {props.userID}</div>
));

describe("Profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getStorage as jest.Mock).mockReturnValue("mockStorage");
    (ref as jest.Mock).mockImplementation((storage, path) => ({
      storage,
      path,
    }));
  });

  it("renders user profile info and tabs with posts and comments", async () => {
    const mockUserID = "testUser123";
    const mockUsername = "Testy";
    const mockImageURL = "https://example.com/profile.png";

    // Mock getDownloadURL to resolve
    (getDownloadURL as jest.Mock).mockResolvedValueOnce(mockImageURL);

    // Mock fetch response for username
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ username: mockUsername }),
    }) as jest.Mock;

    render(<Profile params={Promise.resolve({ user_id: mockUserID })} />);

    // Wait for username and image to load
    await waitFor(() => {
      expect(screen.getByText(mockUsername)).toBeInTheDocument();
    });

    // Avatar should be rendered with correct src
    const avatar = screen.getByRole("img") as HTMLImageElement;
    expect(avatar.src).toBe(mockImageURL);

    // Forum and Comments should be rendered with userID
    expect(await screen.findByTestId("forum")).toHaveTextContent(
      `Forum for ${mockUserID}`
    );

    screen.getByRole("tab", { name: /comments/i }).click();

    expect(await screen.findByTestId("comments")).toHaveTextContent(
      `Comments for ${mockUserID}`
    );
  });

  it("handles profile image loading error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const mockUserID = "brokenUser";

    // Force image fetch to fail
    (getDownloadURL as jest.Mock).mockRejectedValueOnce(
      new Error("Image fetch failed")
    );

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ username: "Broken Image User" }),
    }) as jest.Mock;

    render(<Profile params={Promise.resolve({ user_id: mockUserID })} />);

    await waitFor(() => {
      expect(screen.getByText("Broken Image User")).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error loading profile image:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
