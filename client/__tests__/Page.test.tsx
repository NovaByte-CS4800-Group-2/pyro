import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import Landing from "@/app/page";

// Mock dependencies
jest.mock("@/app/ui/carousel", () => ({
  EmblaCarousel: () => {
    return <div data-testid="embla-carousel">Mocked EmblaCarousel</div>;
  },
}));

// Mock the sessionStorage to simulate user login state
describe("App page layout", () => {
  beforeEach(() => {
    global.sessionStorage.clear();
  });

  // Test for the app layout when logged in
  it("renders the app layout correctly", async () => {
    global.sessionStorage.setItem("user", "true");

    render(<Landing />); // Render the Landing component

    await waitFor(() => { // Check if the page is rendered correctly
      expect(screen.getByText("Our mission:")).toBeInTheDocument();
      expect(screen.getByText("Features:")).toBeInTheDocument();
      expect(screen.getByTestId("embla-carousel")).toBeInTheDocument();
    });
  });

  // Test for the app layout when not logged in
  it("renders the app layout correctly when not logged in", async () => { 
    global.sessionStorage.setItem("user", "false");
    render(<Landing />);

    await waitFor(() => {
      expect(screen.getByText("Ready to Join?")).toBeInTheDocument();
    });
  });
});
