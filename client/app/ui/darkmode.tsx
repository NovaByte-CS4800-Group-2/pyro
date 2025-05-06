"use client";

import { useTheme } from "next-themes";
import { MoonIcon as MoonSolid, SunIcon as SunSolid } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-[--ash-olive] transition"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <SunSolid className="h-6 w-6 text-[--muted-terracotta]" />
        ) : (
        <MoonSolid className="h-6 w-6 text-[--bark]" />
        )}
    </button>
  );
}
