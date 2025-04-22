'use client'
import { useState, useEffect, useRef } from "react";
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleSend = async () => { // Function to handle sending messages
    if (!input.trim()) return;

    const userMessage: { role: "user"; content: string } = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; 
    }
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage: { role: "assistant"; content: string } = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]); // Append the bot's response to the messages
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Error occurred." }]); // Handle error case
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { // Check if the chatbox is open and if there are no messages
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: "Hi there! I'm NovaBot ⭐️🤖. Feel free to ask any questions related to fire safety and response!" }]);
    }
  }, [isOpen]);

  useEffect(() => { // Scroll to the bottom of the chatbox when new messages are added
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => { // Function to handle mouse down event for dragging
    if (!chatboxRef.current) return;
    isDragging.current = true;
    const rect = chatboxRef.current.getBoundingClientRect(); // Get the bounding rectangle of the chatbox
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.addEventListener("mousemove", handleMouseMove); // Add mousemove event listener
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => { // Function to handle mouse move event for dragging
    if (!isDragging.current || !chatboxRef.current) return; // Check if dragging is in progress
    chatboxRef.current.style.left = `${e.clientX - offset.current.x}px`; // Update the left position of the chatbox
    chatboxRef.current.style.top = `${e.clientY - offset.current.y}px`;  // Update the top position of the chatbox
  };

  const handleMouseUp = () => { // Function to handle mouse up event for dragging
    isDragging.current = false; 
    document.removeEventListener("mousemove", handleMouseMove); // Remove mousemove event listener
    document.removeEventListener("mouseup", handleMouseUp); // Remove mouseup event listener
  };

  {/* Render the chatbox component */}
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 bg-[--olive-stone] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-[--deep-moss] z-[100]"
      >
        💬
      </button>

      {isOpen && ( // Render the chatbox if it's open
        <div
          ref={chatboxRef}
          className="fixed bg-[--porcelain] border-2 border-[--bark] rounded-2xl shadow-xl flex flex-col z-[100]"
          style={{ width: "20rem", height: "28rem", resize: "both", overflow: "auto", left: "calc(100% - 23rem)", bottom: "6.5rem" }}
        >
          <div
            onMouseDown={handleMouseDown} // Add mouse down event listener for dragging
            className="bg-[--bark] text-[--porcelain] text-lg font-display font-bold p-3 rounded-t-2xl flex justify-between items-center cursor-move"
          >
            NovaBot ⭐️🤖
            <button
              onClick={() => setIsOpen(false)} // Function to close the chatbox
              className="text-[--porcelain] text-xl font-bold px-2 hover:text-[--muted-terracotta]"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm font-normal flex flex-col">
            {messages.map((msg, idx) => ( // Map through the messages and display them
              <div
              key={idx}
              className={`w-fit max-w-[85%] p-2 rounded-xl whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-[--bark] text-[--porcelain] self-end text-right"
                  : "bg-[--deep-moss] text-[--porcelain] self-start text-left"
              }`}
              >
              {msg.content} {/* Display the message content */}
              </div>
            ))}
            {loading && <div className="text-left text-gray-500">NovaBot is typing...</div>}
            <div ref={bottomRef} />
          </div>

          <div className="flex flex-col border-t border-[--bark] px-3 py-2">
          <div className="flex gap-2 items-end">
            <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { 
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            className="w-full px-3 py-2 border border-[--ash-olive] rounded-lg focus:outline-none focus:ring-2 focus:ring-[--ash-olive] bg-white text-[--bark] resize-none overflow-hidden leading-snug"
            placeholder="Type a message..."
            />
            <button
              onClick={handleSend} // Function to send the message
              className="bg-[--olive-stone] hover:bg-[--deep-moss] px-4 py-2 rounded-lg text-white font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
}