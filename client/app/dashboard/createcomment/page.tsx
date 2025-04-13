"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input, Textarea } from "@heroui/react";
import Button from "@/app/ui/button";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export default function CreatePost() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [postContent, setPostContent] = useState({ body: "" });
  const [city, setCity] = useState<string>("General"); // Default to "general"
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState({
    user_id: 0,
    username: "",
    city: "",
    business_account: 0,
  }); // State for user data
  const [subforums, setSubforums] = useState<any[]>([]); // State to store subforums


}
