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
  }); // State for user data
  const [subforums, setSubforums] = useState<any[]>([]); // State to store subforums

  // Fetch subforums
  useEffect(() => {
    const fetchSubforums = async () => {
      try {
        const response = await fetch("http://localhost:8080/subforums");
        const data = await response.json();
        console.log("Fetched subforums:", data.rows);
        setSubforums(data.rows); // Store subforums in state
      } catch (error) {
        console.error("Error fetching subforums:", error);
        setErrorMessage("Failed to fetch subforums.");
      }
    };

    fetchSubforums();
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user || !user.displayName) {
          setErrorMessage("User is not authenticated.");
          console.log("User is not authenticated:", user);
          return;
        }

        console.log("Fetching user data for username:", user.displayName);

        const userResponse = await fetch(
          `http://localhost:8080/profile/${user.displayName}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          console.error("Error fetching user data:", errorData);
          throw new Error(errorData.error || "Failed to fetch user data.");
        }

        const responseData = await userResponse.json();
        console.log("Fetched user data:", responseData);

        const { profile } = responseData;
        if (!profile) {
          throw new Error("Invalid user data received.");
        }

        setUserData(profile);
        console.log("Updated userData state:", profile);
      } catch (error) {
        setErrorMessage("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    setIsOpen(true);
    setIsClient(true);

    return () => setIsOpen(false);
  }, [user]);

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

    console.log("Submitting post...");
    console.log("Post content:", postContent.body);
    console.log("City (subforum name):", city);
    console.log("User data:", userData);

    if (!postContent.body.trim()) {
      setErrorMessage("Post cannot be empty.");
    }

    if (!city) {
      setErrorMessage("Please select a subforum.");
    }

    if (!userData || !userData.username) {
      setErrorMessage("User data is incomplete. Please try again.");
    }

    try {
      const requestBody = {
        city, // Use the selected subforum name as city
        username: userData.username,
        body: postContent.body,
      };
      console.log("Request body:", requestBody);

      const postResponse = await fetch("http://localhost:8080/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("Post response:", postResponse);

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.error || "Failed to submit post.");
      }

      const postData = await postResponse.json();
      console.log("Post submitted successfully:", postData);

      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      console.error("Error submitting post:", error);
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

            {/* Subforum selection */}
            <div className="mb-4">
              <label
                htmlFor="subforum"
                className="block text-sm font-medium text-gray-700"
              >
                Select Subforum
              </label>
              <select
                id="subforum"
                name="subforum"
                value={city || ""}
                onChange={(e) => setCity(e.target.value)} // Update city instead of subforumId
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>
                  -- Select a Subforum --
                </option>
                {subforums.map((subforum) => (
                  <option
                    key={subforum.subforum_id}
                    value={subforum.name} // Use subforum name as the value
                  >
                    {subforum.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Textarea for post content */}
            <Textarea
              name="body"
              placeholder="Write your post here"
              value={postContent.body}
              onChange={handleChange}
              className="mb-4 w-full"
            />

            {/* File input *}
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
             {/* <div className="flex justify-start">
                <Button
                  label="Add Media"
                  onClick={() => fileInputRef.current?.click()}
                />
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
