import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";
import "@testing-library/jest-dom";

// Mock the child components to isolate the test for RootLayout
jest.mock("@/ui/header", () => () => <div>Mock Header</div>);
jest.mock("@/ui/footer", () => () => <div>Mock Footer</div>);
jest.mock("@/ui/chatbot", () => () => <div>Mock Chatbot</div>);
jest.mock("@/providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div>Mock Providers {children}</div>
  ),
}));

describe("RootLayout Component", () => {
  it("renders the layout with Header, Footer, Chatbot, and children", () => {
    render(
      <RootLayout>
        <div>Test Child Content</div>
      </RootLayout>
    );

    // Check that the Providers wrapper is rendered
    expect(screen.getByText("Mock Providers")).toBeInTheDocument();

    // Check that the Header is rendered
    expect(screen.getByText("Mock Header")).toBeInTheDocument();

    // Check that the Footer is rendered
    expect(screen.getByText("Mock Footer")).toBeInTheDocument();

    // Check that the Chatbot is rendered
    expect(screen.getByText("Mock Chatbot")).toBeInTheDocument();

    // Check that the children are rendered
    expect(screen.getByText("Test Child Content")).toBeInTheDocument();
  });

  it("renders the basic HTML structure correctly", () => {
    render(
      <RootLayout>
        <div>Test Child Content</div>
      </RootLayout>
    );

    // Check that the <html> and <body> tags are present
    expect(document.documentElement.lang).toBe("en");
    expect(document.querySelector("body")).toBeInTheDocument();

    // Check the main content area for children
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass(
      "flex flex-col flex-grow mt-16 mb-16 overflow-auto"
    );
  });
});
