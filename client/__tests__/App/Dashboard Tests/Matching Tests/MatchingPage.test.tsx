import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Matching from "@/app/dashboard/matching/page";

// Mock the dependencies
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

jest.mock("@/app/ui/matchingform", () =>
  jest.fn(() => <div>MatchingForm Component</div>)
);

// Mock the @heroui/react components to avoid dynamic import issues
jest.mock("@heroui/react", () => ({
  Button: ({
    onPress,
    children,
    color,
    className,
  }: {
    onPress?: () => void;
    children: React.ReactNode;
    color?: string;
    className?: string;
  }) => (
    <button onClick={onPress} data-color={color} className={className}>
      {children}
    </button>
  ),
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  CardBody: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

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

  it("resets form state completely after successful deletion", async () => {
    const initialForm = {
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

    // Mock successful delete
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(initialForm),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({ matches: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({}),
      });

    render(<Matching />);

    // Wait for the UI to show the form details
    await waitFor(() => {
      expect(screen.getByText("Hosting Form")).toBeInTheDocument();
    });

    // Delete the form
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Hosting Form")).not.toBeInTheDocument();

      expect(screen.getByText(/After you create a form/)).toBeInTheDocument();

      // Check that the apply buttons are now enabled
      const applyLinks = screen.getAllByRole("link");
      for (const link of applyLinks) {
        expect(link.className).not.toContain("pointer-events-none");
      }
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

    const deleteButton = await screen.findByText("Delete");
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

    const matchButton = await screen.findByText("Match!");
    expect(matchButton).toBeInTheDocument();
    fireEvent.click(matchButton);

    expect(screen.getByText("MatchingForm Component")).toBeInTheDocument();
  });

  it("renders the Housing Form label when type is not 'offering'", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          form: {
            user_id: "12345",
            type: "seeking",
            form_id: 2,
            num_rooms: 1,
            num_people: 1,
            young_children: 0,
            adolescent_children: 0,
            teenage_children: 0,
            elderly: 0,
            small_dog: 0,
            large_dog: 0,
            cat: 0,
            other_pets: 0,
          },
        }),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({ matches: [] }),
      });

    render(<Matching />);
    await waitFor(() => {
      expect(screen.getByText("Housing Form")).toBeInTheDocument();
    });
  });
  
  it("renders MatchingForm with type 0 when form.type != 'offering'", async () => {
    const mockForm = {
      user_id: "12345",
      type: "seeking", 
      form_id: 42,
    };

    const mockMatches = {
      matches: [{ match_id: 999, name: "Fake Match" }],
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({ form: mockForm }),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockMatches),
      });

    render(<Matching />);

    const matchBtn = await screen.findByText("Match!");
    fireEvent.click(matchBtn);

    expect(screen.getByText("MatchingForm Component")).toBeInTheDocument();
  });
});
