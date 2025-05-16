import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Subforumbar from "@/app/ui/subforumbar";

// Mock usePathname to simulate the current URL
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/subforum/2",
}));

beforeEach(() => {
  // Directly mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({
        rows: [
          { subforum_id: 1, name: "General", zipcode: "00000" },
          { subforum_id: 2, name: "Q&A", zipcode: "11111" },
        ],
      }),
      // Add any other properties/methods your code might access on Response
      text: async () => "",
      headers: {
        get: () => null,
      },
    } as unknown as Response)
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("Subforumbar", () => {
  it("renders subforum links by default (desktop)", async () => {
    render(<Subforumbar />);

    await waitFor(() => {
      expect(screen.getByText("General")).toBeInTheDocument();
      expect(screen.getByText("Q&A")).toBeInTheDocument();
    });

    const selected = screen.getByText("Q&A");
    expect(selected.className).toMatch(/font-semibold/);
  });

  it("renders select dropdown on mobile", async () => {
    render(<Subforumbar mobile />);

    const dropdown = await screen.findByRole("combobox");
    expect(dropdown).toBeInTheDocument();

    const generalOption = await screen.findByRole("option", {
      name: "General",
    });
    const qaOption = await screen.findByRole("option", { name: "Q&A" });

    expect(generalOption).toBeInTheDocument();
    expect(qaOption).toBeInTheDocument();
  });

  it("updates selected subforum when user selects from mobile dropdown", async () => {
    // @ts-ignore
    window.location = { href: "" } as any;

    render(<Subforumbar mobile />);

    const dropdown = await screen.findByRole("combobox");
    fireEvent.change(dropdown, { target: { value: "1" } });

    expect(window.location.href).toBe("http://localhost/");
  });

  it("fetches and displays subforums from backend", async () => {
    render(<Subforumbar />);
    await waitFor(() => {
      expect(screen.getByText("General")).toBeInTheDocument();
    });
  });

  it("handles empty subforums gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ rows: [] }),
    });

    render(<Subforumbar />);
    await waitFor(() => {
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });
  it("logs an error if subforum fetch fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Simulate fetch throwing an error
    global.fetch = jest.fn().mockRejectedValue(new Error("Fetch failure"));

    render(<Subforumbar />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch subforums:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
