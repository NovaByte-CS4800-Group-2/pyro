import Host from "@/app/dashboard/matching/host/page";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/ui/matchingform", () => {
  return function MockMatchingForm(props: any) {
    return (
      <div data-testid="mock-matching-form" data-type={props.type}>
        Mocked Matching Form Component
      </div>
    );
  };
});

describe("Host Component", () => {
  it("renders the Host page correctly", () => {
    render(<Host />);

    // Check if the mocked Matching Form component is rendered
    const matchingFormElement = screen.getByTestId("mock-matching-form");
    expect(matchingFormElement).toBeInTheDocument();
    expect(matchingFormElement).toHaveAttribute("data-type", "1");
  });
});
