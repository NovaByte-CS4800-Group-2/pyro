import Link from "next/link";
import "@/app/globals.css";
import React from "react";

interface ButtonProps {
  label: string;
  link?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  label = "Button",
  link = "/",
  onClick,
  type = "button",
}: ButtonProps) {
  if (link) {
    return (
      <Link href={link} className="button">
        {label}
      </Link>
    );
  } else {
    return (
      <button type={type} onClick={onClick} className="button">
        {label}
      </button>
    );
  }
}
