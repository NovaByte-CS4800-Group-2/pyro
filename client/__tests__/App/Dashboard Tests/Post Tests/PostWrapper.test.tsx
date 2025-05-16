import React from "react";
import { render, screen } from "@testing-library/react";
import PostWrapper from "@/app/dashboard/post/[content_id]/postWrapper";
import { useAuthState } from "react-firebase-hooks/auth";

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));
jest.mock("@/app/firebase/config", () => ({ auth: {} }));
jest.mock("@/app/ui/post", () => (props: any) => (
  <div data-testid="post">
    Post:
    <div>body: {props.body}</div>
    <div>isOwner: {String(props.isOwner)}</div>
    <div>isSharedPost: {String(props.isSharedPost)}</div>
    {props.children}
  </div>
));

jest.mock("@/app/ui/comments", () => (props: any) => (
  <div data-testid="comments">
    Comments for {props.contentId} (shared: {String(props.isSharedPost)})
  </div>
));

const mockedUseAuthState = useAuthState as jest.Mock;

const mockPost = {
  userId: "u123",
  posterId: "u123",
  username: "TestUser",
  date: "2024-01-01",
  editeddate: "2024-01-02",
  body: "Test body",
  contentId: 456,
  isVerified: true,
  isOwner: true,
};

describe("PostWrapper", () => {
  beforeEach(() => {
    mockedUseAuthState.mockReturnValue([{ displayName: "TestUser" }]);
  });

  it("renders Post and Comments components correctly with isSharedPost=false", () => {
    render(<PostWrapper post={mockPost} />);

    const post = screen.getByTestId("post");
    const comments = screen.getByTestId("comments");

    expect(post).toHaveTextContent("Test body");
    expect(post).toHaveTextContent("isSharedPost: false");
    expect(post).toHaveTextContent("isOwner: false"); // overridden inside
    expect(comments).toHaveTextContent("Comments for 456 (shared: false)");
  });

  it("renders correctly with isSharedPost=true", () => {
    render(<PostWrapper post={mockPost} isSharedPost={true} />);

    const post = screen.getByTestId("post");
    const comments = screen.getByTestId("comments");

    expect(post).toHaveTextContent("isSharedPost: true");
    expect(comments).toHaveTextContent("shared: true");
  });
});
