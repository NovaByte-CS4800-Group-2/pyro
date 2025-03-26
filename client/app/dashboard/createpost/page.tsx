import React from "react";

const CreatePost = () => {
  return <div>CreatePost</div>;
};

export default CreatePost;

/* "use client";

import React, { useState, useEffect, useRef } from "react";
import { Input, Textarea } from "@heroui/react";
import Button from "@/app/ui/button";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export default function CreateContent() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [postContent, setPostContent] = useState({
    body: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  //const [showFileInput, setShowFileInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    setIsOpen(true);
    setIsClient(true);

    return () => setIsOpen(false);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPostContent({ ...postContent, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!postContent.body.trim()) {
      setErrorMessage("Post cannot be empty.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("city", "Default City");
      formData.append("username", user?.email || "Anonymous");
      formData.append("body", postContent.body);

      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
        formData.append(`file_types[${index}]`, file.type);
      });

      const response = await fetch("http://localhost:8080/post", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit post.");
      }
      console.log("Post submitted successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occured.");
    }
  };
  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-60">
          {errorMessage}
          <button
            className="ml-4 text-white font-bold"
            onClick={() => setErrorMessage(null)}
          >
            ✕
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="absolute inset-0 bg-black opacity-50 z-40" />
          <div className="bg-white p-6 rounded-lg w-1/3 z-50 shadow-xl">
            <h2 className="text-xl font-bold mb-4">New Post</h2>

            <Textarea
              name="body"
              placeholder="Write your post here"
              value={postContent.body}
              onChange={handleChange}
              className="mb-4 w-full"
            />

            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mb-4 w-full"
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            <div className="mb-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>{file.name}</span>,
                  <button
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button label="Cancel" onClick={handleCancel} />
              <Button
                type="submit"
                label="Post"
                onClick={handleSubmit}
                disabled={!postContent.body.trim()}
              />
              <div className="flex justify-start">
                <Button
                  label="Add Media"
                  onClick={() => fileInputRef.current?.click()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
*/
