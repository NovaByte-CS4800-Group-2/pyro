"use client";

import { FireIcon } from "@heroicons/react/24/outline";
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
  console.log({ user });
  if (typeof window !== "undefined" && window.sessionStorage) {
    userSession = sessionStorage.getItem("user");
  }

  useEffect(() => {
    if (!user && !userSession) {
      router.push("/"); // Navigate to home if no user or session
    }
  }, [user, userSession, router]);

  let html = <></>;

  console.log(user);
  if (!user && !userSession) {
    html = (
      <nav className="w-1/3 flex justify-end items-center p-5 gap-2 font-semibold">
        <Button link="/log-in" label="Log In" />
        <Button link="/register" label="Register" />
      </nav>
    );
  } else if (pathname?.includes("register") || pathname?.includes("log-in")) {
    html = (
      <nav className="w-1/3 flex justify-end items-center p-5 gap-2 font-semibold">
        <Button label="Back" link="/" />
      </nav>
    );
  } else {
    html = (
      <nav className="w-1/3 flex justify-end items-center p-5 gap-2 font-semibold">
        <Button label="Dashboard" link="/dashboard" />
        <Button label="Logout" link="/logout" />
      </nav>
    );
  }

  return (
    <div className="flex bg-[var(--liver)] border-t-2 border-[var(--liver)] w-full h-18 font-display mt-auto">
      <div className="w-1/3" />
      <Link href="/" className="flex justify-center items-center w-1/3">
        <FireIcon className="text-[var(--cocoa-brown)] w-9.5" />
        <h1 className="text-[var(--seashell)] text-4xl font-bold">Pyro</h1>
      </Link>
      {html}
    </div>
  );
}
