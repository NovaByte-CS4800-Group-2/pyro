import Submission from "@/app/dashboard/matching/submission/page";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@heroui/react", () => {
  return {
    Button: function MockButton(props: any) {
      return (
        <button data-testid="mock-button" onClick={props.onClick}>
          {props.children}
        </button>
      );
    },
    Link: "a",
  };
});

describe("Submission Component", () => {
  it("renders the Submission page correctly", () => {
    render(<Submission />);

    // Check if the mocked Button component is rendered
    const buttonElement = screen.getByTestId("mock-button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Return to matching page");
  });
});
