"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { CircularProgress } from "@heroui/react";

export default function Logout() {
  // Router to redirect the user.
  const router = useRouter();

  // Function to handle logging out.
  // Logout will trigger when this component is rendered.
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push("/");
      } catch (e) {
        console.error("Error signing out:", e);
      }
    };

    handleLogout();
  }, [router]);

  // Return html
  return (
    <div className="flex flex-row items-center justify-center h-screen">
      <CircularProgress className="pr-4" color="primary" aria-label="Loading..." /><h1 className="text-2xl font-bold">Logging out...</h1>
    </div>
  );
}
