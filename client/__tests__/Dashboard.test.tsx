import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "@/app/dashboard/page";
import "@testing-library/jest-dom";
import "whatwg-fetch";

it("renders the dashboard page", async () => {
  render(<Dashboard />);
  await waitFor(() => {
    // Check if the Forum component is rendered
    const forumElement = screen.getByText(/forum/i); // Adjust the text match if needed
    expect(forumElement).toBeInTheDocument();

    // Check if the Subforumbar component is rendered
    const subforumbarElement = screen.getByText(/subforums/i); // Adjust the text match if needed
    expect(subforumbarElement).toBeInTheDocument();
  });
});
