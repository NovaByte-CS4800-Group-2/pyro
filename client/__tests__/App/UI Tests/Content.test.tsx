import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Content from "@/app/ui/content";

// 🧪 Mocks
jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getDownloadURL: jest.fn(() =>
    Promise.resolve(
      "https://mocked.storage.firebase.com/media/file.123456.mp4?token=abc"
    )
  ),
}));

jest.mock("@heroui/react", () => ({
  Modal: ({ isOpen, children }: any) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,

  ModalContent: ({ children }: any) => (
    <div>{typeof children === "function" ? children(() => {}) : children}</div>
  ),

  ModalHeader: ({ children }: any) => <div>{children}</div>,
  ModalBody: ({ children }: any) => <div>{children}</div>,
  ModalFooter: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, onClick, onPress, ...rest }: any) => (
    <button onClick={onClick || onPress} {...rest}>
      {children}
    </button>
  ),
  Avatar: ({ src }: any) => <img data-testid="avatar" src={src} alt="avatar" />,
  Link: ({ children }: any) => <a>{children}</a>,
}));

jest.mock("@heroicons/react/24/outline", () => ({
  EllipsisVerticalIcon: (props: any) => (
    <svg data-testid="menu-icon" {...props} onClick={props.onClick} />
  ),
}));

jest.mock("@/app/ui/vote", () => () => <div data-testid="vote">Vote</div>);

describe("Content", () => {
  const baseProps = {
    userId: "u1",
    posterId: "u1",
    username: "Hadya",
    contentType: "post" as const,
    contentId: 123,
    body: "Hello world!",
    postDate: "2024-01-01",
    lastEditDate: "",
    isOwner: true,
    isVerified: true,
    onUpdateContent: jest.fn(),
    onDeleteContent: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: [] }),
    });
  });

  it("renders a post with avatar and vote", async () => {
    const { getDownloadURL } = require("firebase/storage");
    getDownloadURL.mockResolvedValueOnce("https://mocked.url/avatar.png");
    render(<Content {...baseProps} />);

    expect(await screen.findByText("Hadya")).toBeInTheDocument();
    expect(
      screen.getByText((text) => /Posted|Edited/.test(text))
    ).toBeInTheDocument();
    expect(screen.getByText("Hello world!")).toBeInTheDocument();
    expect(screen.getByTestId("vote")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "src",
        expect.stringContaining("mocked.url")
      );
    });
  });

  it("handles profile picture fetch failure silently", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { getDownloadURL } = require("firebase/storage");
    getDownloadURL.mockRejectedValueOnce(new Error("no profile pic"));

    render(<Content {...baseProps} />);

    // Wait for useEffect to run
    await waitFor(() => {
      expect(screen.getByText("Hadya")).toBeInTheDocument();
    });

    // Confirm that *our* fetch error is not logged — but allow React errors
    const loggedMessages = errorSpy.mock.calls.map((call) => call[0]);
    const dateError = loggedMessages.find((msg) =>
      String(msg).includes("Error fetching profile")
    );

    expect(dateError).toBeUndefined();

    errorSpy.mockRestore();
  });

  it("highlights matched text using highlightMatch", async () => {
    render(
      <Content {...baseProps} body="This is a match test" search="match" />
    );

    const highlighted = await screen.findByText("match");
    expect(highlighted.tagName).toBe("MARK");
  });

  it("shows the edit/delete menu and handles edit modal", async () => {
    render(<Content {...baseProps} />);

    fireEvent.click(screen.getByTestId("menu-icon"));

    const editBtn = screen.getByText("Edit");
    fireEvent.click(editBtn);

    const modal = screen.getByTestId("modal");
    expect(modal).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Updated content" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(baseProps.onUpdateContent).toHaveBeenCalled();
    });
  });

  it("opens delete modal and confirms deletion", async () => {
    render(<Content {...baseProps} />);
    fireEvent.click(screen.getByTestId("menu-icon"));
    fireEvent.click(screen.getByText("Delete"));

    expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(baseProps.onDeleteContent).toHaveBeenCalled();
    });
  });

  it("shows error if deleteContent fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock).mockImplementation(() => {
      throw new Error("delete failed");
    });

    render(<Content {...baseProps} />);

    fireEvent.click(screen.getByTestId("menu-icon"));
    fireEvent.click(screen.getByText("Delete")); // open modal

    const deleteConfirmButton = await screen.findByText("Delete", {
      selector: "button",
    });
    fireEvent.click(deleteConfirmButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to delete post.")).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error deleting post:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("shows error if editContent fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ result: [] }) }) // media fetch
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "edit failed" }),
      }); // edit post fails

    render(<Content {...baseProps} />);

    fireEvent.click(screen.getByTestId("menu-icon")); // open menu
    fireEvent.click(screen.getByText("Edit")); // open edit modal

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "broken edit" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error editing post:",
        expect.any(Error)
      );
      expect(screen.getByText("Failed to edit post.")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("logs error if handleDelete fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock fetch to succeed during initial render
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ result: [] }),
    });

    render(<Content {...baseProps} />);

    // Open menu + modal
    fireEvent.click(screen.getByTestId("menu-icon"));
    fireEvent.click(screen.getByText("Delete"));

    // Now temporarily spy on the internal `deleteContent` via the global fetch
    // and make the first call throw (simulate deleteContent breaking)
    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      throw new Error("handleDelete blew up");
    });

    const deleteConfirmBtn = await screen.findByText("Delete", {
      selector: "button",
    });
    fireEvent.click(deleteConfirmBtn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error deleting post:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("logs error if handleEdit throws", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Initial fetches succeed
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ result: [] }) }) // media fetch
      .mockImplementationOnce(() => {
        throw new Error("network died"); // breaks inside editContent
      });

    render(<Content {...baseProps} />);

    // Open edit modal
    fireEvent.click(screen.getByTestId("menu-icon"));
    fireEvent.click(screen.getByText("Edit"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "trigger error" },
    });

    fireEvent.click(screen.getByText("Save")); // triggers handleEdit → editContent

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error editing post:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("handles exception in formatDate gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const originalToLocaleString = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = () => {
      throw new Error("💥 date blew up");
    };

    render(
      <Content
        {...baseProps}
        postDate="2024-01-01" // valid date
      />
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Date formatting error:",
        expect.any(Error)
      );
    });

    // Restore for other tests
    Date.prototype.toLocaleString = originalToLocaleString;
    consoleSpy.mockRestore();
  });

  it("renders as comment with default fallback styles", () => {
    render(<Content {...baseProps} contentType="comment" isVerified={false} />);
    expect(screen.getByText("Hello world!")).toBeInTheDocument();
  });

  it("renders error if media fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("fail"));

    render(<Content {...baseProps} />);
    await waitFor(() => {
      // No media rendered = pass
      expect(screen.queryByAltText(/Media/)).not.toBeInTheDocument();
    });
  });

  it("silently handles media fetch errors (getDownloadURL fails)", async () => {
    const { getDownloadURL } = require("firebase/storage");

    getDownloadURL.mockImplementation(() =>
      Promise.reject(new Error("media load fail"))
    );

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: ["media.bad.1.png"], // simulate 1 media item
      }),
    });

    render(<Content {...baseProps} />);

    await waitFor(() => {
      expect(screen.getByText("Hadya")).toBeInTheDocument();
    });
  });

  it("renders image and video URLs", async () => {
    const { getDownloadURL } = require("firebase/storage");
    getDownloadURL.mockReset();
    getDownloadURL
      .mockResolvedValueOnce("https://example.com/a.b.c.d.png?token=image") // index 5 = "png?..."
      .mockResolvedValueOnce("https://example.com/a.b.c.d.mp4?token=video"); // index 5 = "mp4?..."

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: ["image.png", "video.mp4"], // irrelevant; just triggers the map
      }),
    });

    const { container } = render(<Content {...baseProps} />);

    await waitFor(() => {
      expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
      expect(container.querySelectorAll("video").length).toBeGreaterThan(0);
    });
  });
});
