"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export default function Navbar() {
  const pathname = usePathname();
  console.log("Pathname", pathname)
  const [user] = useAuthState(auth);

  const allNavLinks = [
  { href: "/dashboard", label: "Forum" },
  { href: "/dashboard/fundraiser", label: "Fundraisers" },
  { href: "/dashboard/resources", label: "Resources" },
  { href: "/dashboard/matching", label: "Matching Requests" },
];

const navLinks = user
  ? allNavLinks
  : allNavLinks.filter((link) =>
      ["/dashboard", "/dashboard/fundraiser", "/dashboard/resources"].includes(link.href)
    );

  return (
    <div className={`flex flex-col min-w-[200px] bg-stone-100 border-l border-stone-300 shadow-sm`} >
      <h2 className="text-lg font-bold font-display px-4 py-3 text-neutral-800 border-b border-stone-200">
        Navigation
      </h2>
      {navLinks.map((link) => {
        // const isActive =
        //   (link.href === "/dashboard" && pathname.startsWith("/dashboard")) &&
        //   !pathname.startsWith("/dashboard/fundraiser") &&
        //   !pathname.startsWith("/dashboard/resources") &&
        //   !pathname.startsWith("/dashboard/matching") ||
        //   pathname === link.href;
        const isActive =
        pathname && // Ensure pathname is not null or undefined
        pathname !== "/dashboard/profile" &&
        link.href === "/dashboard" && pathname.startsWith("/dashboard") &&
        !pathname.startsWith("/dashboard/fundraiser") &&
        !pathname.startsWith("/dashboard/resources") &&
        !pathname.startsWith("/dashboard/matching") ||
        pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={` px-4 py-3 border border-transparent transition-colors block font-normal
              ${isActive
                ? "bg-[--greige-deep] text-white font-semibold"
                : "bg-[--greige-mist] text-[--bark] hover:bg-[--ash-olive] hover:text-[--deep-moss]"
              }`}                
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}