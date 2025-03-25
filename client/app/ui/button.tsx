import Link from "next/link";
import "@/app/globals.css";

export default function Button({ label = "Button", link = "/" }) {
  return (
    <Link href={link} className="button">
      {label}
    </Link>
  );
}
