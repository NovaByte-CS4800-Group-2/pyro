"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import Navbar from "../ui/navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Router for redirecting to the dashboard.
  const router = useRouter();
  const [user] = useAuthState(auth);
  let userSession = null;

  if (typeof window !== "undefined" && window.sessionStorage) {
    userSession = sessionStorage.getItem("user");
  }

  if (!user && !userSession) {
    return router.push("/");
  }
  return (
    <div className="flex justify-stretch items-stretch flex-row flex-grow">
      <Navbar></Navbar>
      {children}
    </div>);
}
