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

  it("renders image and video URLs", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: [
          "media.fake.file.1.2.3.img.png?token=abc",
          "media.fake.file.4.5.6.clip.mp4?token=xyz",
        ],
      }),
    });

    const { container } = render(<Content {...baseProps} />);

    await waitFor(() => {
      expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
      expect(container.querySelectorAll("video").length).toBeGreaterThan(0);
    });
  });
});
