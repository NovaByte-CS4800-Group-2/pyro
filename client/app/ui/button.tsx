import Link from "next/link";
import "@/app/globals.css";

export default function Button({ label = "Button", link = "/" }) {
  return (
    <Link href={link} className="button">
      {label}
    </Link>
  );
}

/* import Link from "next/link";
import "@/app/globals.css";
import React from "react";

interface ButtonProps {
  label: string;
  link?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  label = "Button",
  link,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  if (link) {
    return (
      <Link href={link} className="button">
        {label}
      </Link>
    );
  } else {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="button"
      >
        {label}
      </button>
    );
  }
}
*/
