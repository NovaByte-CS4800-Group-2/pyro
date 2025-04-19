import { render, screen, waitFor } from "@testing-library/react";
import RootLayout from "@/app/layout";
import "@testing-library/jest-dom";
import "whatwg-fetch";

// test for the app layout when logged in
describe("RootLayout Component", () => {
  it("renders the app layout correctly", async () => { 
    render( // Render the RootLayout component
      <RootLayout> 
        <div>Test Content</div>
      </RootLayout>
    );
    await waitFor(() => {
      expect(screen.getByText("Test Content")).toBeInTheDocument(); // Check if the Test Content is rendered
    });
  });
});
