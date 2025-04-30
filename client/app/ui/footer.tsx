import Link from "next/link";
import "@/app/globals.css";
import Image from "next/image";
import Button from "./button";

export default function Footer() {
  return (
    <footer
      className="w-full shadow-inner rounded-t-2xl px-6 py-4 flex justify-between items-center text-[--text-color] font-display mt-auto"
      style={{ backgroundColor: "var(--clay-beige)" }}
    >
      <div className="w-1/3 text-sm pl-1">
        <p>&copy; 2025 Nova Byte</p>
      </div>

      <Link
        target="_blank"
        href="https://novabyte-cs4800-group-2.github.io/NovaByte-website/"
        className="flex justify-center w-1/3"
      >
        <Image
          src="/logo-transparent-svg.svg"
          alt="The Nova Byte Logo"
          width={150}
          height={40}
          className="object-contain"
        />
      </Link>

      <div className="w-1/3 flex justify-end pr-2">
        <Button label="Contact Us" link="/contact" />
      </div>
    </footer>
  );
}
