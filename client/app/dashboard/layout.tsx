"use client";
import "@/app/globals.css";
import Navbar from "../ui/navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularProgress } from "@heroui/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Router for redirecting the user.
  const router = useRouter();
  const pathname = usePathname();

  // Authentication functions
  const [user, loading] = useAuthState(auth);
  const [authenticating, setAuthenticating] = useState<Boolean>(true);

  // Function to check if user is signed in.
  useEffect(() => {
    const userSession =
      typeof window !== "undefined" && sessionStorage.getItem("user");

    // Allow dashboard even if not logged in
    // if (!user && !userSession && !pathname.startsWith("/dashboard")){
    //   // If user is not signed in and not on dashboard, redirect to home
    //   return router.push("/");
    // } else {
    //   setAuthenticating(false);
    // }
    if ( pathname != null && !user && !userSession && !pathname.startsWith("/dashboard")) 
    {
      return router.push("/");
    } else {
      setAuthenticating(false);
    }
  }, [user, pathname]);

  // Return html
  if (authenticating) {
    return (
      <div className="flex items-center justify-center bg-[--greige-mist] flex-grow">
        <CircularProgress
          className="pr-4"
          color="primary"
          aria-label="Authenticating ..."
        />
        <h2 className="text-2xl font-bold">Authenticating ...</h2>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-[--greige-mist] mt-2 mb-2">
        <Navbar />
        {children}
      </div>
    );    
  }
}