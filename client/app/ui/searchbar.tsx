"use client";

import { Input } from "@heroui/input";
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full mb-4 hover:!border-[--deep-terracotta] ${className || ""}`}
      />
  );
}