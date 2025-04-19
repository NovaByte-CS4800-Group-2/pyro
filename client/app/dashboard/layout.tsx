"use client";
import "@/app/globals.css";
import Navbar from "../ui/navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularProgress } from "@heroui/react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Router for redirecting the user.
  const router = useRouter();
  // Authentication functions
  const [user, loading] = useAuthState(auth);
  const [authenticating, setAuthenticating] = useState<Boolean>(true);

  // Function to check if user is signed in.
  useEffect(() => {
    /* Check session */
    if (!user && !loading) {
      return router.push("/");
    }
    else {
      setAuthenticating(false);
    }
  }, [user]);

  // Return html
  if (authenticating) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <CircularProgress className="pr-4" color="primary" aria-label="Authenticating ..." /><h2 className="text-2xl font-bold">Authenticating ...</h2>
      </div>
    );
  }
  else {
    return (
      <div className="flex justify-stretch items-stretch flex-row flex-grow mt-2 mb-2">
        <Navbar></Navbar>
        {children}
      </div>);
  }
}