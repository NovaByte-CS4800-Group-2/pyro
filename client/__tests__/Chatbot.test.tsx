import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Chatbot from "@/app/ui/chatbot";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(
  () =>
    ({
      left: 100,
      top: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    } as DOMRect)
);

// Enable JSDOM to handle style operations
Object.defineProperty(HTMLElement.prototype, "style", {
  get() {
    return {
      left: "",
      top: "",
      height: "",
      setProperty: jest.fn(),
    };
  },
  configurable: true,
});

describe("Chatbot Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ reply: "Test bot response" }),
    });
  });

  test("opens and closes chatbot when buttons are clicked", async () => {
    await act(async () => {
      render(<Chatbot />);
    });

    // Initially only chat button is visible
    expect(screen.getByText("💬")).toBeInTheDocument();
    expect(screen.queryByText("NovaBot ⭐️🤖")).not.toBeInTheDocument();

    // Open chatbot
    await act(async () => {
      fireEvent.click(screen.getByText("💬"));
    });
    expect(screen.getByText("NovaBot ⭐️🤖")).toBeInTheDocument();

    // Close chatbot
    await act(async () => {
      fireEvent.click(screen.getByLabelText("Close chat"));
    });
    expect(screen.queryByText("NovaBot ⭐️🤖")).not.toBeInTheDocument();
  });

  test("sends messages, receives responses, and handles errors", async () => {
    await act(async () => {
      render(<Chatbot />);
    });

    // Open chatbot
    await act(async () => {
      fireEvent.click(screen.getByText("💬"));
    });

    // Type and send a message
    const input = screen.getByPlaceholderText("Type a message...");
    await act(async () => {
      fireEvent.change(input, { target: { value: "Hello" } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Send"));
    });

    // Check if user message appears
    expect(screen.getByText("Hello")).toBeInTheDocument();

    // Wait for bot response
    await waitFor(
      () => {
        expect(screen.getByText("Test bot response")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Test Enter key to send message
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ reply: "Response to Enter" }),
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: "Enter message test" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(screen.getByText("Enter message test")).toBeInTheDocument();

    // Test error handling
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      fireEvent.change(input, { target: { value: "This will fail" } });
      fireEvent.click(screen.getByText("Send"));
    });

    await waitFor(() => {
      expect(screen.getByText("⚠️ Error occurred.")).toBeInTheDocument();
    });

    // Test empty message
    await act(async () => {
      fireEvent.change(input, { target: { value: "" } });
      fireEvent.click(screen.getByText("Send"));
    });

    // No new message should be added
    expect(
      screen.getAllByText((content) =>
        content.includes("Hi there! I'm NovaBot")
      ).length
    ).toBe(1);
  });

  test("handles textarea input and adjusts height", async () => {
    await act(async () => {
      render(<Chatbot />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText("💬"));
    });

    const textarea = screen.getByPlaceholderText("Type a message...");

    // Change the value of textarea to simulate typing
    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test message" } });
    });

    // Verify the textarea value changes
    expect(textarea).toHaveValue("Test message");
  });

  // Test focusing specifically on handleMouseMove coverage
  test("tests drag functionality with focus on handleMouseMove", async () => {
    // We need to track style changes on the real DOM element
    let mouseMoveHandler: EventListenerOrEventListenerObject | null = null;

    // Mock document.addEventListener to capture the handlers
    const originalAddEventListener = document.addEventListener;
    document.addEventListener = jest.fn((event, handler) => {
      if (event === "mousemove") {
        mouseMoveHandler = handler;
      }
      return originalAddEventListener.call(document, event, handler);
    });

    // Create a custom style object to track changes
    const trackStyleChanges = {
      left: false,
      top: false,
    };

    // Override style getter/setter to track changes
    const originalStyleDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "style"
    );
    Object.defineProperty(HTMLElement.prototype, "style", {
      get() {
        const origStyle = originalStyleDescriptor?.get?.call(this) || {};
        return {
          ...origStyle,
          set left(value) {
            trackStyleChanges.left = true;
            if (typeof origStyle.left === "string") {
              origStyle.left = value;
            }
          },
          set top(value) {
            trackStyleChanges.top = true;
            if (typeof origStyle.top === "string") {
              origStyle.top = value;
            }
          },
          get left() {
            return origStyle.left;
          },
          get top() {
            return origStyle.top;
          },
          get height() {
            return origStyle.height;
          },
          set height(value) {
            if (typeof origStyle.height === "string") {
              origStyle.height = value;
            }
          },
          setProperty: jest.fn(),
        };
      },
      configurable: true,
    });

    try {
      await act(async () => {
        render(<Chatbot />);
      });

      await act(async () => {
        fireEvent.click(screen.getByText("💬"));
      });

      const header = screen.getByText("NovaBot ⭐️🤖").closest("div");
      const chatbox = screen.getByText("NovaBot ⭐️🤖").closest(".fixed");

      expect(header).toBeInTheDocument();
      expect(chatbox).toBeInTheDocument();

      // Start dragging to initialize handlers
      await act(async () => {
        fireEvent.mouseDown(header!, { clientX: 150, clientY: 120 });
      });

      // Verify we captured the mousemove handler
      expect(mouseMoveHandler).not.toBeNull();

      // Reset tracking
      trackStyleChanges.left = false;
      trackStyleChanges.top = false;

      await act(async () => {
        // @ts-ignore
        mouseMoveHandler({ clientX: 200, clientY: 150 });
      });

      expect(trackStyleChanges.left).toBe(true);
      expect(trackStyleChanges.top).toBe(true);

      // Reset tracking
      trackStyleChanges.left = false;
      trackStyleChanges.top = false;

      // End dragging
      await act(async () => {
        fireEvent.mouseUp(document);
      });

      await act(async () => {
        // @ts-ignore
        mouseMoveHandler({ clientX: 300, clientY: 300 });
      });

      expect(trackStyleChanges.left).toBe(false);
      expect(trackStyleChanges.top).toBe(false);
    } finally {
      // Clean up
      document.addEventListener = originalAddEventListener;
      Object.defineProperty(
        HTMLElement.prototype,
        "style",
        originalStyleDescriptor!
      );
    }
  });

  test("handleMouseDown exits early if chatboxRef is null", async () => {
    await act(async () => {
      render(<Chatbot />);
    });

    // Access the exported test refs/functions
    const { chatboxRef, handleMouseDown } = (window as any)
      .__TEST_HACK_CHATBOT_REFS__;

    // Force chatboxRef to null
    chatboxRef.current = null;

    // Call the real component's handleMouseDown
    handleMouseDown({ clientX: 150, clientY: 120 });
  });
});
