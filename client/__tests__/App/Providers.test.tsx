import { render, screen } from "@testing-library/react";
import { Providers } from "@/app/providers";
import "@testing-library/jest-dom";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("Providers", () => {
  it("renders the children correctly", () => {
    render(
      <Providers>
        <div>Hello World</div>
      </Providers>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
