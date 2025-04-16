import Link from "next/link"; // Importing Link from Next.js for client-side navigation
import "@/app/globals.css"; // Importing global styles
import React from "react"; // Importing React for building UI components

interface ButtonProps {
  // Define the props for the Button component
  label: string; // The text to display on the button
  link?: string; // Optional link to navigate to when the button is clicked
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Optional click event handler for the button
  type?: "button" | "submit" | "reset"; // The type of the button (default is "button")
  disabled?: boolean; // Optional flag to disable the button (default is false)
}

export default function Button({
  // Define the Button component
  label = "Button", // Default label for the button
  link,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  // Destructure the props with default values
  if (link) {
    // If a link is provided, render a Link component
    return (
      <Link href={link} className="button">
        {" "}
        {/* Use Link for client-side navigation */}
        {label}
      </Link>
    );
  } else {
    // If no link is provided, render a button element
    return (
      <button
        type={type} // Set the button type
        onClick={onClick} // Set the click event handler
        disabled={disabled} // Set the disabled state
        className="button" // Apply button styles
      >
        {label} {/* Display the button label */}
      </button>
    );
  }
}
