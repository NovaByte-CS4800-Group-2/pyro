"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Forum" },
    { href: "/dashboard/fundraiser", label: "Fundraisers" },
    { href: "/dashboard/resources", label: "Resources" },
    { href: "/dashboard/matching", label: "Matching Requests" },
  ];

  return (
    <div className="flex flex-col min-w-[200px] bg-stone-100 border-r border-stone-400 shadow-sm">
      <h2 className="text-lg font-semibold px-4 py-3 text-neutral-800 border-b border-stone-300">
        Navigation
      </h2>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-left px-4 py-3 border-b border-stone-200 transition-colors block
              ${isActive
                ? "bg-stone-300 text-black font-semibold"
                : "bg-white text-neutral-800 hover:bg-stone-200 hover:text-neutral-900"
              }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

