import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Post from "@/app/ui/post";

jest.mock("@/app/ui/content", () => (props: any) => (
  <div data-testid="content">
    <button onClick={props.onUpdateContent}>Update</button>
    <button onClick={props.onDeleteContent}>Delete</button>
    {props.children}
  </div>
));

jest.mock("@/app/ui/comments", () => (props: any) => (
  <div data-testid="comments">Comments for {props.contentId}</div>
));

jest.mock("@heroicons/react/24/outline", () => ({
  ShareIcon: () => <svg data-testid="share-icon" />,
}));
jest.mock("@heroui/react", () => {
  const original = jest.requireActual("@heroui/react");

  return {
    ...original,
    Modal: ({ isOpen, onOpenChange, children }: any) =>
      isOpen ? (
        <div data-testid="modal">
          {typeof children === "function"
            ? children(() => onOpenChange(false))
            : children}
        </div>
      ) : null,

    ModalContent: ({ children }: any) => {
      const onClose = () => {}; // mock noop just to satisfy signature
      return (
        <div data-testid="modal-content">
          {typeof children === "function" ? children(onClose) : children}
        </div>
      );
    },

    ModalHeader: ({ children }: any) => <div>{children}</div>,
    ModalBody: ({ children }: any) => <div>{children}</div>,
    ModalFooter: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick, onPress }: any) => (
      <button onClick={onClick || onPress}>{children}</button>
    ),
    Link: ({ children }: any) => <a>{children}</a>,
  };
});

beforeEach(() => {
  // Mock clipboard
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(),
    },
  });

  // Mock window.location
  // @ts-ignore
  window.location = {
    origin: "https://example.com",
    pathname: "/dashboard/post/1",
  };
});

describe("Post", () => {
  const baseProps = {
    contentId: 1,
    subforumId: "123",
    body: "Hello",
    username: "User",
    posterId: "uid123",
    userId: "uid123",
    date: "2024-01-01",
    lastEditDate: "2024-01-02",
    isOwner: true,
    isVerified: true,
    search: "",
    onRefresh: jest.fn(),
    contentType: "post" as const, // or the appropriate type expected
    postDate: "2024-01-01", // or the appropriate value
    onUpdateContent: jest.fn(),
    onDeleteContent: jest.fn(),
  };

  it("renders content and comments", () => {
    render(<Post {...baseProps} />);

    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("comments")).toHaveTextContent("Comments for 1");
  });

  it("calls onRefresh on update and delete", () => {
    render(<Post {...baseProps} />);
    fireEvent.click(screen.getByText("Update"));
    fireEvent.click(screen.getByText("Delete"));
    expect(baseProps.onRefresh).toHaveBeenCalledTimes(2);
  });

  it("opens share modal on click", () => {
    render(<Post {...baseProps} />);
    fireEvent.click(screen.getByText("Share"));
    expect(screen.getByText("Share Post")).toBeInTheDocument();
  });

  it("copies link to clipboard and shows toast", async () => {
    render(<Post {...baseProps} />);
    fireEvent.click(screen.getByText("Share"));
    fireEvent.click(screen.getByText("Copy Link"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "http://localhost/dashboard/post/1"
    );

    await waitFor(() => {
      expect(screen.getByText("Link copied to clipboard!")).toBeInTheDocument();
    });
  });
});
