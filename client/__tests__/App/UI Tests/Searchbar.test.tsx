import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/app/ui/searchbar";
import "@testing-library/jest-dom";

describe("SearchBar Component", () => {
  test("renders with correct className logic and handles onChange", () => {
    const mockOnChange = jest.fn();

    // Test with className provided
    const { rerender } = render(
      <SearchBar value="" onChange={mockOnChange} className="custom-class" />
    );

    const inputWithClass = screen.getByPlaceholderText("Search...");
    expect(inputWithClass).toHaveClass("custom-class");
    expect(inputWithClass).toHaveAttribute("type", "text");

    // Test the onChange handler
    fireEvent.change(inputWithClass, { target: { value: "test" } });
    expect(mockOnChange).toHaveBeenCalledWith("test");

    // Test without className (default case)
    rerender(<SearchBar value="" onChange={mockOnChange} />);
    const inputWithoutClass = screen.getByPlaceholderText("Search...");
    expect(inputWithoutClass).toBeInTheDocument();
  });
});
