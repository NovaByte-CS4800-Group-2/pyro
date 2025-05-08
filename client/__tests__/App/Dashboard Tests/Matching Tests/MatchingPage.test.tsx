import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Matching from "@/app/dashboard/matching/page";
import { form, user } from "@heroui/react";

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

jest.mock("@/app/ui/matchingform", () =>
  jest.fn(() => <div>MatchingForm Component</div>)
);

// Mock fetch globally
global.fetch = jest.fn();

describe("Matching Component", () => {
  const mockUser = { uid: "12345" };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthState as jest.Mock).mockReturnValue([{ uid: "12345" }]);
    // fallback to 404 if no specific mock is given
    (fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        status: 404,
        json: async () => ({}),
      })
    );
  });

  it("renders the component correctly", () => {
    render(<Matching />);
    expect(
      screen.getByText("Welcome to the Matching Page!")
    ).toBeInTheDocument();
    expect(screen.getByText("Apply to Host")).toBeInTheDocument();
    expect(screen.getByText("Apply for Housing")).toBeInTheDocument();
  });

  it("fetches user application and sets form state", async () => {
    const mockFormResponse = {
      form: {
        user_id: "12345",
        type: "offering",
        form_id: 1,
        num_rooms: 3,
        num_people: 2,
        young_children: 1,
        adolescent_children: 0,
        teenage_children: 0,
        elderly: 0,
        small_dog: 0,
        large_dog: 1,
        cat: 0,
        other_pets: 0,
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockFormResponse),
    });

    render(<Matching />);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get/user/form/12345`,
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    await waitFor(() => {
      expect(screen.getByText("Bedrooms: 3")).toBeInTheDocument();
      expect(screen.getByText("Guests: 2")).toBeInTheDocument();
    });
  });

  it("fetches matches when form state is set", async () => {
    const mockMatchesResponse = {
      matches: [
        { match_id: 1, name: "Match 1" },
        { match_id: 2, name: "Match 2" },
      ],
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          form: {
            user_id: "12345",
            type: "offering",
            form_id: 1,
          },
        }),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockMatchesResponse),
      });

    render(<Matching />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    await waitFor(() => {
      expect(screen.getByText("Match Available!")).toBeInTheDocument();
    });
  });

  it("handles delete form", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          form: {
            user_id: "12345",
            type: "offering",
            form_id: 1,
            num_rooms: 3,
            num_people: 2,
            young_children: 1,
            adolescent_children: 0,
            teenage_children: 0,
            elderly: 0,
            small_dog: 0,
            large_dog: 1,
            cat: 0,
            other_pets: 0,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
      })
      .mockResolvedValueOnce({
        status: 200,
        json: async () => ({ form: { user_id: "", type: "", form_id: 0 } }),
      });

    render(<Matching />);

    const deleteButton = await screen.findByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/delete/form/1`,
        expect.objectContaining({
          method: "DELETE",
        })
      )
    );

    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes(
            "After you create a form you will be able to see its status here"
          )
        )
      ).toBeInTheDocument();
    });
  });

  it("shows an error alert when delete fails", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          form: {
            user_id: "12345",
            type: "offering",
            form_id: 1,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
      });

    window.alert = jest.fn();

    render(<Matching />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Error deleting your form. Please try again later."
      )
    );
  });

  it("toggles showMatches state and displays MatchingForm component", async () => {
    const mockMatchesResponse = {
      matches: [
        { match_id: 1, name: "Match 1" },
        { match_id: 2, name: "Match 2" },
      ],
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          form: {
            user_id: "12345",
            type: "offering",
            form_id: 1,
          },
        }),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockMatchesResponse),
      });

    render(<Matching />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    const matchButton = await screen.findByText(/Match!/i);
    expect(matchButton).toBeInTheDocument();
    fireEvent.click(matchButton);

    expect(screen.getByText("MatchingForm Component")).toBeInTheDocument();
  });
});
