"use client";
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
    value,
    onChange,
    placeholder,
    className = "",
  }: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Search..."}
      className={`w-full p-2 rounded-xl border border-[--porcelain] bg-[--porcelain] text-[--bark] 
        placeholder-[--ash-olive] focus:outline-none focus:ring-1 focus:ring-[--bark] 
        hover:bg-[--clay-beige]${className}`}
    />
  );
}