"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { Input, Textarea } from "@heroui/react";
import Button from "@/app/ui/button";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export default function CreateContent() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [postContent, setPostContent] = useState({ body: "" });
  const [subformId, setSubformId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState<any[]>([]);

  // Fetch subform ID on component mount
  useEffect(() => {
    const fetchSubformId = async () => {
      try {
        const response = await fetch("http://localhost:8080/subforums", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const text = await response.text();

        if (!response.ok) {
          console.error("Server responded with error HTML or message:", text);
          throw new Error("Failed to fetch subform ID.");
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error("Failed to parse JSON response:", error);
          throw new Error("Invalid response format.");
        }
        if (data.subform_id) {
          setSubformId(data.subform_id);
        } else {
          throw new Error("Subform ID is undefined.");
        }
      } catch (error) {
        console.error("Error fetching subform ID:", error);
        setErrorMessage("Failed to fetch subform ID.");
      }
    };

    fetchSubformId();
    setIsOpen(true);
    setIsClient(true);

    return () => setIsOpen(false);
  }, []);

  useEffect(() => {
    if (subformId) {
      const fetchPosts = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/posts/${subformId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch posts.");
          }

          const data = await response.json();
          console.log("Fetched posts:", data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
      fetchPosts();
    }
  }, [subformId]);

  // Handle input changes for post content
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPostContent({ ...postContent, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!postContent.body.trim()) {
      setErrorMessage("Post cannot be empty.");
      return;
    }

    try {
      const formData = new FormData();

      if (user?.uid) {
        formData.append("user_id", user.uid);
      } else {
        throw new Error("User ID is undefined.");
      }

      formData.append("subform_id", subformId || "");
      formData.append("body", postContent.body);

      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
        formData.append(`file_types[${index}]`, file.type);
      });

      // Re-fetch posts
      const response = await fetch(`http://localhost:8080/posts/${subformId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const updatedPosts = await response.json();
      setPosts(updatedPosts);

      const postResponse = await fetch("http://localhost:8080/post", {
        method: "POST",
        body: formData,
      });

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.error || "Failed to submit post.");
      }

      console.log("Post submitted successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  // Handle cancel button click
  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Error Message */}
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

      {/* Modal for creating a new post */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="absolute inset-0 bg-black opacity-50 z-40" />
          <div className="bg-white p-6 rounded-lg w-1/3 z-50 shadow-xl">
            <h2 className="text-xl font-bold mb-4">New Post</h2>

            {/* Textarea for post content */}
            <Textarea
              name="body"
              placeholder="Write your post here"
              value={postContent.body}
              onChange={handleChange}
              className="mb-4 w-full"
            />

            {/* File input */}
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mb-4 w-full"
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {/* Display selected files */}
            <div className="mb-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>{file.name}</span>
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

            {/* Action buttons */}
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
      {/* Render fetched posts */}
      <div className="w-full p-4 mt-4">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="border-b mb-4 pb-4">
              <h3 className="text-lg font-bold">{post.user_id}</h3>
              <p>{post.body}</p>
              <p className="text-gray-500 text-sm">{post.post_date}</p>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}
