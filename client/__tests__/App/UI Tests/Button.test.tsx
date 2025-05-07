import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/app/ui/button";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return (
      <a href={href} data-testid="mock-link">
        {children}
      </a>
    );
  };
});

describe("Button Component", () => {
  //basic button rendering test
  test("renders a button with the correct label", () => {
    render(<Button label="Click Me" />);

    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("button");
  });

  // link rendering test
  test("renders as a link when link prop is provided", () => {
    render(<Button label="Go to Home" link="/home" />);

    const link = screen.getByTestId("mock-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
    expect(link.textContent).toContain("Go to Home");
  });

  // click event test
  test("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Click Me" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders a button with the correct button type", () => {
    render(<Button label="Submit Form" type="submit" />);

    const button = screen.getByRole("button", { name: "Submit Form" });
    expect(button).toHaveAttribute("type", "submit");
  });

  test("renders disabled button when disabled prop is true", () => {
    render(<Button label="Disabled Button" disabled={true} />);

    const button = screen.getByRole("button", { name: "Disabled Button" });
    expect(button).toBeDisabled();
  });
  // Test for link content including whitespace
  test("renders link with proper content", () => {
    render(<Button label="Test Button" link="/test" />);

    const link = screen.getByTestId("mock-link");
    // Check the raw HTML to ensure all content is rendered
    expect(link.innerHTML).toContain(" "); // This checks for the whitespace
    expect(link.textContent).toContain("Button"); // Default label
  });
});
