"use client";

import React, { useState, useEffect } from "react";
import { Input, Textarea, user } from "@heroui/react";
import Button from "@/app/ui/button";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export default function CreatePost() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [postContent, setPostContent] = useState({
    body: "",
    has_media: false,
  });

  const [isClient, setIsClient] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    setIsClient(true);
    setIsOpen(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPostContent({ ...postContent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...postContent,
          user_id: user?.uid,
          has_media: false,
        }),
      });

      //debugging
      const data = await response.json();
      if (response.ok) {
        console.log("Post created sucessfully:", data);
        setIsOpen(false);
        setPostContent({ body: "", has_media: false });
        router.push("/dashboard");
      } else {
        console.error("Failed to create post:", data);
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };
  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10 backdrop-blur-md">
          <div className="absolute inset-0 bg-black opacity-50 z-10" />
          <div className="bg-white p-6 rounded-lg w-1/3 z-20 shadow-xl">
            <h2 className="text-xl font-bold mb-4">New Post</h2>

            <Textarea
              name="body"
              placeholder="Write your post here"
              value={postContent.body}
              onChange={handleChange}
              className="mb-4 w-full"
            />

            <div className="flex justify-end">
              <Button label="Cancel" link="/dashboard" />
              <Button type="submit" label="Post" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
