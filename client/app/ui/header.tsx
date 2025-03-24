"use client";

import { FireIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import "@/app/globals.css";
import { usePathname } from "next/navigation";
import Button from "./button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const router = useRouter();

  let userSession = null;
  if (typeof window !== "undefined" && window.sessionStorage) {
    userSession = sessionStorage.getItem("user");
  }

  useEffect(() => {
    if (!user && !userSession) {
      router.push("/");
    }
  }, [user, userSession, router]);

  let navContent = <></>;

  if (pathname?.includes("register") || pathname?.includes("log-in")) {
    navContent = (
      <nav className="flex justify-end items-center gap-2">
        <Button label="Back" link="/" />
      </nav>
    );
  } else if (!user && !userSession) {
    navContent = (
      <nav className="flex justify-end items-center gap-2">
        <Button link="/log-in" label="Log In" />
        <Button link="/register" label="Register" />
      </nav>
    );
  } else if (!pathname?.includes("dashboard")) {
    navContent = (
      <nav className="flex justify-end items-center gap-2">
        <Button label="Dashboard" link="/dashboard" />
        <Button label="Logout" link="/logout" />
      </nav>
    );
  } else {
    navContent = (
      <nav className="flex justify-end items-center gap-2">
        <Button label="Create Post" link="/dashboard/createcontent" />
        <Button label="Logout" link="/logout" />
        <Link href="/dashboard/profile">
          <UserCircleIcon className="text-[--bark] w-8 hover:text-[--ash-olive]" />
        </Link>
      </nav>
    );
  }

  return (
    <header
      className="w-full shadow-md rounded-b-2xl px-6 py-4 flex justify-between items-center text-[--text-color]"
      style={{ backgroundColor: "var(--clay-beige)" }}
    >
      <div className="w-1/3" />

      {/* pyro logo */}
      <Link href="/" className="flex items-center gap-2 w-1/3 justify-center">
        <FireIcon className="w-8" style={{ color: "var(--deep-terracotta)" }} />
        <h1 className="text-3xl font-display font-bold text-[--bark]">Pyro</h1>
      </Link>

      <div className="w-1/3 flex justify-end items-center gap-3">
        {navContent}
      </div>
    </header>
  );
}
