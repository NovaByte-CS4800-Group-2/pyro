'use client'

import "@/app/globals.css";
import { BellIcon, FireIcon } from "@heroicons/react/24/outline";
import { Avatar, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import Link from "next/link";
import Button from "./button";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useEffect } from "react";
import { useState } from "react";
import Notifications from "./notifications";

export default function Header() {
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/unread/notifications/${user.uid}`);
        const data = await res.json();
        setHasUnread(data.unread === true);
      } catch (err) {
        console.error("Failed to fetch unread notifications:", err);
      }
    };

    fetchUnread();
  }, [user]);

  let navContent = <></>;

  if (pathname?.includes("register") || pathname?.includes("log-in")) {
    navContent = (
      <div className="flex flex-wrap sm:flex-nowrap justify-end items-center gap-2">
        <Button label="Back" link="/" />
      </div>
    );
  } else if (!user) {
    navContent = (
      <div className="flex flex-wrap sm:flex-nowrap justify-end items-center gap-2">
        <Button link="/log-in" label="Log In" />
        <Button link="/register" label="Register" />
      </div>
    );
  } else if (!pathname?.includes("dashboard")) {
    navContent = (
      <div className="flex flex-wrap sm:flex-nowrap justify-end items-center gap-2">
        <Button label="Dashboard" link="/dashboard" />
        <Button label="Logout" link="/logout" />
      </div>
    );
  } else {
    navContent = (
      <div className="flex flex-wrap sm:flex-nowrap justify-end items-center gap-2">
        <Button label="Create Post" link="/dashboard/createpost" />
        <Button label="Logout" link="/logout" />
        
        <Popover
          offset={20}
          placement="bottom-end"
          isOpen={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (open) {
              setHasUnread(false); 
            }
          }}
        >
          <PopoverTrigger>
            <div className="relative w-10 h-10 mx-1 flex items-center justify-center">
              <BellIcon className="w-8 hover:text-[--deep-moss] focus:text-[--deep-moss]" tabIndex={0} />
              {hasUnread && (
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 max-h-[300px] min-w-[300px] overflow-y-auto">
              {user && <Notifications userId={user.uid} username={user.displayName ?? 'Unknown'} />}
            </div>
          </PopoverContent>
        </Popover>
        <Avatar as={Link} href="/dashboard/profile" className="w-10 h-10" isBordered src={user?.photoURL || undefined} />
      </div>
    );
  }

  return (
    <header
      className="w-full shadow-md rounded-b-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 text-[--text-color]"
      style={{ backgroundColor: "var(--clay-beige)" }}
    >

      <div className="w-full sm:w-1/3 flex justify-start" />

      {/* pyro logo */}
      <Link href="/" className="flex items-center gap-2 w-full sm:w-1/3 justify-center">
        <FireIcon className="w-8" style={{ color: "var(--deep-terracotta)" }} />
        <h1 className="text-3xl font-display font-bold text-[--bark]">Pyro</h1>
      </Link>

      
      <div className= "w-full sm:w-1/3 flex justify-center sm:justify-end items-center gap-2 flex-wrap sm:flex-nowrap">
        {navContent}
      </div>
    </header>
  );
}
