import Fundraiser from "@/app/dashboard/fundraiser/page";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/ui/forum", () => {
  return function MockForum(props: any) {
    return (
      <div data-testid="mock-forum" data-subforum-id={props.subforumID}>
        Mocked Forum Component
      </div>
    );
  };
});

describe("Fundraiser Component", () => {
  it("renders the Fundraiser page correctly", () => {
    render(<Fundraiser />);

    // Check if the mocked Forum component is rendered
    const forumElement = screen.getByTestId("mock-forum");
    expect(forumElement).toBeInTheDocument();
    expect(forumElement).toHaveAttribute("data-subforum-id", "0");
  });
});
