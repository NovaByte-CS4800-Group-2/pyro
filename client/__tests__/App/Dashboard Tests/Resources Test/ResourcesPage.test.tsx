import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Resources from "@/app/dashboard/resources/page";

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("Resources Page", () => {
  it("renders all major headings", () => {
    render(<Resources />);

    expect(screen.getByText("Wildfire Preparedness")).toBeInTheDocument();
    expect(screen.getByText("Wildire Survival")).toBeInTheDocument();
    expect(screen.getByText("Wildfire Response")).toBeInTheDocument();
  });

  it("copies a link and shows toast message", async () => {
    render(<Resources />);

    const copyButton = screen.getAllByText("Copy Link")[0];
    fireEvent.click(copyButton);

    // clipboard call
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://readyforwildfire.org/prepare-for-wildfire/emergency-supply-kit/"
    );

    // toast should appear
    await waitFor(() => {
      expect(screen.getByText("Link copied to clipboard!")).toBeInTheDocument();
    });
  });

  it("shows correct toast for each card when clicked", async () => {
    render(<Resources />);

    const buttons = screen.getAllByText("Copy Link");

    for (const btn of buttons) {
      fireEvent.click(btn);

      // Make sure toast appears
      await waitFor(() => {
        expect(screen.getByText("Link copied to clipboard!")).toBeInTheDocument();
      });
    }
  });
});
