import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MatchingForm from "@/app/ui/matchingform";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));
jest.mock("@/app/firebase/config", () => ({ auth: {} }));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@heroicons/react/24/outline", () => ({
  ArrowUturnLeftIcon: () => <svg data-testid="back-icon" />,
}));
jest.mock("@heroui/react", () => {
  const original = jest.requireActual("@heroui/react");

  return {
    ...original,
    useDisclosure: () => ({
      isOpen: true,
      onOpen: jest.fn(),
      onOpenChange: jest.fn(),
    }),
    Modal: ({ isOpen, children }: any) =>
      isOpen ? (
        <div data-testid="modal">
          {typeof children === "function" ? children(() => {}) : children}
        </div>
      ) : null,
    ModalContent: ({ children }: any) => (
      <div>
        {typeof children === "function" ? children(() => {}) : children}
      </div>
    ),
    ModalHeader: ({ children }: any) => <div>{children}</div>,
    ModalBody: ({ children }: any) => <div>{children}</div>,
    ModalFooter: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick, onPress }: any) => (
      <button onClick={onClick || onPress}>{children}</button>
    ),
    Checkbox: ({ children, ...props }: any) => (
      <label>
        <input type="checkbox" {...props} /> {children}
      </label>
    ),
    Form: ({ children, onSubmit }: any) => (
      <form onSubmit={onSubmit}>{children}</form>
    ),
    NumberInput: ({ label, ...rest }: any) => (
      <label>
        {label}
        <input type="number" {...rest} />
      </label>
    ),
    Slider: () => <div data-testid="slider">Slider</div>,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  (useAuthState as jest.Mock).mockReturnValue([
    { uid: "abc123", email: "test@nova.com" },
  ]);
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

  // 👇 FIX
  Element.prototype.scrollIntoView = jest.fn();
  (Element.prototype as any).focus = jest.fn();

  global.fetch = jest.fn();
});

describe("MatchingForm", () => {
  it("sanitizes zipcode input", () => {
    render(<MatchingForm type={1} />);
    const input = screen.getByPlaceholderText("12345");
    fireEvent.change(input, { target: { value: "12a-3@!45" } });
    expect(input).toHaveValue("12345");
  });

  it("blocks submission without agreeing to terms", async () => {
    render(<MatchingForm type={1} />);
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() =>
      expect(document.activeElement?.id).toBe("react-aria-«r5»")
    );
  });

  it("rejects form with invalid child/guest counts", async () => {
    render(<MatchingForm type={0} />);
    fireEvent.change(screen.getByPlaceholderText("12345"), {
      target: { value: "90210" },
    });
    fireEvent.change(screen.getByLabelText("Number of Guests"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Young Children"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByLabelText(/I acknowledge/));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(
        screen.getByText(/should not equal the total number/i)
      ).toBeInTheDocument();
    });
  });

  it("submits and receives matches", async () => {
    // Setup mocks
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 7 }) }) // create form
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          matches: [{ form_id: 99, email: "matched@nova.com" }],
        }),
      }); // found matches

    render(<MatchingForm type={1} />);
    fireEvent.change(screen.getByPlaceholderText("12345"), {
      target: { value: "90210" },
    });
    fireEvent.change(screen.getByLabelText("Number of Bedrooms"), {
      target: { value: 1 },
    });
    fireEvent.change(screen.getByLabelText("Number of Guests"), {
      target: { value: 1 },
    });
    fireEvent.click(screen.getByLabelText(/I acknowledge/));
    fireEvent.click(screen.getByText("Submit"));

    await screen.findByText(/Take me there!/);
    expect(screen.getByText(/We've found a match/i)).toBeInTheDocument();
  });

  it("renders found matches and handles accept flow", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const match = {
      form_id: 11,
      email: "matched@nova.com",
      num_rooms: 2,
      num_people: 3,
      young_children: 0,
      adolescent_children: 0,
      teenage_children: 0,
      elderly: 1,
      small_dog: 1,
      large_dog: 0,
      cat: 0,
      other_pets: 0,
    };

    render(<MatchingForm type={1} found_matches={[match]} form_id={10} />);
    await screen.findByText("Match 1");
    fireEvent.click(screen.getByText("Accept"));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/send/matching/notification"),
        expect.any(Object)
      )
    );
  });
});
