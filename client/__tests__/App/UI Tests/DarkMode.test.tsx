import DarkModeToggle from "@/app/ui/darkmode";
import { render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import "@testing-library/jest-dom";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("DarkModeToggle", () => {
  it("renders Sun icon when theme is dark", async () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      setTheme: jest.fn(),
    });

    render(<DarkModeToggle />);

    const button = await screen.getByRole("button");

    const sunIcon = button.querySelector("svg");
    expect(sunIcon).toHaveClass("text-[--muted-terracotta]");
  });
});
