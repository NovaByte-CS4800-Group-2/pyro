import Success from "@/app/dashboard/matching/success/page";
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

describe("Success Component", () => {
  it("renders the Success page correctly", () => {
    render(<Success />);

    // Check if the mocked Button component is rendered
    const buttonElement = screen.getByTestId("mock-button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Return to matching page");
  });
});
