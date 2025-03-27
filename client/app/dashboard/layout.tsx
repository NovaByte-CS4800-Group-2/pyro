"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import Navbar from "../ui/navbar";
import { useEffect, useState } from "react";
import { CircularProgress } from "@heroui/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [authenticating, setAuthenticating] = useState<Boolean>(true);

  useEffect(() => {
    /* Check session */
    let userSession = null;
    if (typeof window !== "undefined" && window.sessionStorage) {
      userSession = sessionStorage.getItem("user");
    }
    if (!user && !userSession) {
      return router.push("/");
    }
    else {
      setAuthenticating(false);
    }
  }, [user]);

  if (authenticating) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <CircularProgress className="pr-4" color="primary" aria-label="Loading..." /><h2 className="text-2xl font-bold">Authenticating ...</h2>
      </div>
    );
  }
  else {
    return (
      <div className="flex justify-stretch items-stretch flex-row flex-grow">
        <Navbar></Navbar>
        {children}
      </div>);
  }
}