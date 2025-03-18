'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      sessionStorage.removeItem("user");
      router.push("/"); 
    };
    
    logout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Logging out...</h1>
    </div>
  );
}
