import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MatchingForm from "@/app/ui/matchingform";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

let termsInput: HTMLInputElement | null = null;

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
    Checkbox: ({ children, id, ...props }: any) => (
      <label htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          ref={(el) => {
            if (id === "terms") termsInput = el;
          }}
          {...props}
        />{" "}
        {children}
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
  termsInput = null;
  (useAuthState as jest.Mock).mockReturnValue([
    { uid: "abc123", email: "test@nova.com" },
  ]);
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

  // 👇 FIX
  Element.prototype.scrollIntoView = jest.fn();
  (Element.prototype as any).focus = function () {
    // mock focus: do nothing or add custom logic if needed
  };

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
    const fetchSpy = jest.spyOn(global, "fetch");

    render(<MatchingForm type={1} />);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });
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

  it("shows error if total people exceed declared guests", async () => {
    render(<MatchingForm type={0} />);

    fireEvent.change(screen.getByPlaceholderText("12345"), {
      target: { value: "90210" },
    });

    // Say 1 guest total
    fireEvent.change(screen.getByLabelText("Number of Guests"), {
      target: { value: "1" },
    });

    // But add multiple dependents = 3 total people
    fireEvent.change(screen.getByLabelText("Young Children"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Adolescent Children"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Teenage Children"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText(/I acknowledge/i));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(
        screen.getByText(/should not exceed the total number of guests/i)
      ).toBeInTheDocument(); // ✅ proves this block ran
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

  it("shows alert and redirects if user's form was already matched", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const pushMock = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    (global.fetch as jest.Mock)
      // resUserForm
      .mockResolvedValueOnce({ status: 204, ok: true });

    const match = {
      form_id: 42,
      email: "matched@nova.com",
      num_rooms: 1,
      num_people: 2,
      young_children: 0,
      adolescent_children: 0,
      teenage_children: 0,
      elderly: 0,
      small_dog: 0,
      large_dog: 0,
      cat: 0,
      other_pets: 0,
    };

    render(<MatchingForm type={1} found_matches={[match]} form_id={99} />);

    fireEvent.click(await screen.findByText("Accept"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Your form has already been matched by another user! Please see your notifications for more information."
      );
      expect(pushMock).toHaveBeenCalledWith("/dashboard/matching");
    });

    alertSpy.mockRestore();
  });

  it("alerts and redirects when single match is already matched", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ status: 200, ok: true }) // resUserForm
      .mockResolvedValueOnce({ status: 204, ok: true }); // resMatchForm

    const match = {
      form_id: 42,
      email: "matched@nova.com",
      num_rooms: 1,
      num_people: 2,
      young_children: 0,
      adolescent_children: 0,
      teenage_children: 0,
      elderly: 0,
      small_dog: 0,
      large_dog: 0,
      cat: 0,
      other_pets: 0,
    };

    render(<MatchingForm type={1} found_matches={[match]} form_id={99} />);

    fireEvent.click(await screen.findByText("Accept"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Sorry, this form has already been matched by another user. You will receive a notification when another match is found."
      );
      expect(pushMock).toHaveBeenCalledWith("/dashboard/matching");
    });

    alertSpy.mockRestore();
  });

  it("alerts and removes matched form when multiple matches exist", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ status: 200, ok: true }) // resUserForm
      .mockResolvedValueOnce({ status: 204, ok: true }); // resMatchForm

    const match1 = {
      form_id: 42,
      email: "match1@nova.com",
      num_rooms: 1,
      num_people: 2,
      young_children: 0,
      adolescent_children: 0,
      teenage_children: 0,
      elderly: 0,
      small_dog: 0,
      large_dog: 0,
      cat: 0,
      other_pets: 0,
    };

    const match2 = {
      ...match1,
      form_id: 43,
      email: "match2@nova.com",
    };

    render(
      <MatchingForm type={1} found_matches={[match1, match2]} form_id={99} />
    );

    const acceptButtons = await screen.findAllByText("Accept");
    fireEvent.click(acceptButtons[1]); // click match #2's button

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Sorry, this form has already been matched by another user. Please select another one."
      );
    });

    alertSpy.mockRestore();
  });

  it("shows alert when match fetch fails", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    // 1st fetch: create form succeeds
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      })
      // 2nd fetch: get match fails
      .mockResolvedValueOnce({ ok: false });

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

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Server Error: Matching could not be performed."
      );
    });

    alertSpy.mockRestore();
  });

  it("redirects if no matches are found (204)", async () => {
    const pushMock = jest.fn();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 }),
      }) // resCreate
      .mockResolvedValueOnce({
        status: 204,
        ok: true,
      }); // resMatch

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

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard/matching/submission");
    });

    alertSpy.mockRestore();
  });

  it("shows alert when form creation fails", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    // Simulate fetch failure on form creation
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false }); // create form fails

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

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Unable to create form. Please try again later."
      );
    });

    alertSpy.mockRestore();
  });
  it("shows alert when first notification send fails", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ status: 200, ok: true }) // resUserForm
      .mockResolvedValueOnce({ status: 200, ok: true }) // resMatchForm
      .mockResolvedValueOnce({ ok: false }); // resNotification = FAIL

    const match = {
      form_id: 42,
      email: "matched@nova.com",
      num_rooms: 1,
      num_people: 2,
      young_children: 0,
      adolescent_children: 0,
      teenage_children: 0,
      elderly: 0,
      small_dog: 0,
      large_dog: 0,
      cat: 0,
      other_pets: 0,
    };

    render(<MatchingForm type={1} found_matches={[match]} form_id={99} />);

    fireEvent.click(await screen.findByText("Accept"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "SYSTEM ERROR: Form matching not completed (notification not sent), please try again."
      );
    });

    alertSpy.mockRestore();
  });
  it("shows alert when second notification send fails", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ status: 200, ok: true }) // resUserForm
      .mockResolvedValueOnce({ status: 200, ok: true }) // resMatchForm
      .mockResolvedValueOnce({ ok: true }) // resNotification (1st) succeeds
      .mockResolvedValueOnce({ ok: false }); // resNotification2 (2nd) fails

    const match = {
      form_id: 42,
      email: "matched@nova.com",
      num_rooms: 1,
      num_people: 2,
      young_children: 0,
      adolescent_children: 0,
      teenage_children: 0,
      elderly: 0,
      small_dog: 0,
      large_dog: 0,
      cat: 0,
      other_pets: 0,
    };

    render(<MatchingForm type={1} found_matches={[match]} form_id={99} />);

    fireEvent.click(await screen.findByText("Accept"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "SYSTEM ERROR: Form matching not completed (notification not sent), please try again."
      );
    });

    alertSpy.mockRestore();
  });
  it("shows alert and redirects if deleting matched form fails", async () => {
  const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  const pushMock = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

  (global.fetch as jest.Mock)
    .mockResolvedValueOnce({ status: 200, ok: true }) // resUserForm
    .mockResolvedValueOnce({ status: 200, ok: true }) // resMatchForm
    .mockResolvedValueOnce({ ok: true })              // resNotification 1
    .mockResolvedValueOnce({ ok: true })              // resNotification 2
    .mockResolvedValueOnce({ ok: false });            // resDelete = fail

  const match = {
    form_id: 42,
    email: "matched@nova.com",
    num_rooms: 1,
    num_people: 2,
    young_children: 0,
    adolescent_children: 0,
    teenage_children: 0,
    elderly: 0,
    small_dog: 0,
    large_dog: 0,
    cat: 0,
    other_pets: 0,
  };

  render(<MatchingForm type={1} found_matches={[match]} form_id={99} />);

  fireEvent.click(await screen.findByText("Accept"));

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith(
      "SYSTEM ERROR: Form may have been deleted :("
    );
    expect(pushMock).toHaveBeenCalledWith("/dashboard/matching");
  });

  alertSpy.mockRestore();
});

});
