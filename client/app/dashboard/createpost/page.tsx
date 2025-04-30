"use client";

import React, { useState, useEffect, useRef } from "react"; // Import React and hooks
import { Textarea, Button } from "@heroui/react"; // Import Textarea components from heroui
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { useAuthState } from "react-firebase-hooks/auth"; // Import useAuthState from firebase hooks
import { auth } from "@/app/firebase/config"; // Import Firebase auth configuration
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline"; // Import icons from heroicons
// function to create a new post
export default function CreatePost() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
  const [isClient, setIsClient] = useState(false); // State to check if the component is mounted
  const [postContent, setPostContent] = useState({ body: "" });
  const [city, setCity] = useState<string>("General"); // Default to "general forum"
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [user] = useAuthState(auth); // Get the current authenticated user
  const [userData, setUserData] = useState({
    // Initial user data state
    user_id: 0,
    username: "",
    city: "",
    business_account: 0,
  });
  const [subforums, setSubforums] = useState<any[]>([]); // State to store subforums

  const [media, setMedia] = useState<File[]>([]); // State to store media files
  const [mediaPreviewURLs, setMediaPreviewURLs] = useState<string[]>([]); // State to store media preview URLs
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  // Fetch subforums when the component mounts
  useEffect(() => { 
    const fetchSubforums = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/subforums` 
        );
        const data = await response.json();
        setSubforums(data.rows); // Store subforums in state
      } catch (error) { // Handle errors
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
        if (!user || !user.displayName) { // Check if user is authenticated
          setErrorMessage("User is not authenticated."); // Handle unauthenticated user
          return;
        }
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/${user.displayName}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        // if the response is not okay, throw an error
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error || "Failed to fetch user data.");
        }

        // Parse the response data
        const responseData = await userResponse.json();

        // Check if the response contains the expected data
        const { profile } = responseData;
    
        // Set user data in state
        setUserData(profile);
      } catch (error) { // Handle errors
        setErrorMessage("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [user]);

  // Set modal open state when user data is available
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

  // Handle form submission for personal accounts
  const handlePersonalSubmit = async () => {

    if (!postContent.body.trim()) { // Check if post content is empty
      setErrorMessage("Post cannot be empty.");
    }

    if (!city) { // Check if a subforum is selected
      setErrorMessage("Please select a subforum.");
    }

    if (!userData || !userData.username) { // Check if user data is incomplete
      setErrorMessage("User data is incomplete. Please try again.");
    }

    // create a request body for the post submission to send to backend
    try { 

      const requestBody = {
        city: city, // Use the selected subforum name as city
        username: userData.username, // Use the username from user data
        body: postContent.body, // content of the post
      };
      console.log("Request body:", requestBody); // Log the request body for debugging

      // Send a POST request to the backend to create a new post
      const postResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      // if the response is not okay, throw an error
      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.error || "Failed to submit post.");
      }

      // Parse the response data
      const postData = await postResponse.json();

      const str = postContent.body;
      const regex = /@([\w.-]+)/g; // regex to search for the @'s
      const matches = [...str.matchAll(regex)].map(match => match[1]); // extract the names from the @'s

      if(matches.length !== 0)
      {
        const requestBody = {
          content_id: postData.id, 
          calledOuts: matches,
          username: userData.username,
        };

        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/send/callout/notification`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );
      }

      // Fetch the subforum ID based on the selected city (subforum name)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get/subforum/${city}`
      );
      const data = await res.json();

      // send user back to selected subforum page to see post
      router.push(`/dashboard/subforum/${data.subforumId}`);
    } catch (error: any) { // Handle errors
      setErrorMessage(error.message || "An unexpected error occurred.");
      console.error("Error submitting post:", error);
    }
  };

  // Handle form submission for business accounts
  const handleBusinessSubmit = async () => {

    // Check if post content is empty
    if (!postContent.body.trim()) {
      setErrorMessage("Post cannot be empty.");
    }

    // Check if user data is incomplete
    if (!userData || !userData.username) {
      setErrorMessage("User data is incomplete. Please try again.");
    }

    // create a request body for the post submission to send to backend
    try {
      const requestBody = {
        city: "Fundraiser", // Businesses can only post to fundraiser forum
        username: userData.username, // Use the username from user data
        body: postContent.body, // content of the post
      };
      console.log("Request body:", requestBody); // Log the request body for debugging

      // Send a POST request to the backend to create a new post
      const postResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      // Log the response for debugging
      console.log("Post response:", postResponse);

      // if the response is not okay, throw an error
      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.error || "Failed to submit post.");
      }

      // Parse the response data
      const postData = await postResponse.json();

      // Log the post data for debugging
      console.log("Post submitted successfully:", postData);

      // send user back to fundraiser page to see post
      router.push("/dashboard/fundraiser");
    } catch (error: any) { // Handle errors
      setErrorMessage(error.message || "An unexpected error occurred.");
      console.error("Error submitting post:", error);
    }
  };

  // Handle cancel button click
  const handleCancel = async () => {
    if (userData.business_account) { // Check if the user is a business account
      router.push("/dashboard/fundraiser"); // Redirect to fundraiser page
    } else { // Check if the user is a personal account
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/get/subforum/${city}` // Fetch subforum ID based on the selected city (subforum name)
      );
      const data = await res.json(); // Parse the response data

      // send user back to selected subforum page to see post
      router.push(`/dashboard/subforum/${data.subforumId}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; // Check if files are selected
    const newFiles = Array.from(e.target.files); // Convert FileList to array
    const validFiles = newFiles.filter((file) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4']; // Allowed file types

      if (!validTypes.includes(file.type)) {
        setErrorMessage(`Invalid file type: ${file.name}`); // Set error message for invalid file type
        return false; // Exclude invalid files
      }

      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviewURLS = [...mediaPreviewURLs]; // Create a copy of the current preview URLs

    validFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newPreviewURLS.push(url);
      } else {
        // For non-images, we'll just use the file type as placeholder
        newPreviewURLS.push(file.type);
      }
    });
    
    setMedia([...media, ...validFiles]);
    setMediaPreviewURLs(newPreviewURLS);
  };

  const handleAddMediaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = [...media];
    const newPreviewURLS = [...mediaPreviewURLs];
    
    // If the URL is an object URL, revoke it to avoid memory leaks
    if (newPreviewURLS[index].startsWith('blob:')) {
      URL.revokeObjectURL(newPreviewURLS[index]);
    }
    
    newMedia.splice(index, 1);
    newPreviewURLS.splice(index, 1);
    
    setMedia(newMedia);
    setMediaPreviewURLs(newPreviewURLS);
  };

  // Check if the component is mounted
  if (!isClient) return null;

  // post creation modal
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-60">
          {errorMessage}
        </div>
      )}

      {/* Modal for creating a new post */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="absolute inset-0 bg-black opacity-50 z-40" />
          <div className="bg-white p-6 rounded-lg w-1/3 z-50 shadow-xl">
            <h2 className="text-xl font-bold mb-4">New Post</h2>

            {/* Subforum selection */}
            {!userData.business_account && ( // Check if the user is a business account
              <div className="mb-4">
                <label
                  htmlFor="subforum"
                  className="block text-sm font-medium text-gray-700"
                >
                  -- Select Subforum --
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
                  {subforums.map((subforum) => { // Map through subforums
                    if (
                      !userData.business_account && // Check if the user is not a business account
                      subforum.subforum_id != 0 // Exclude the "Fundraiser" subforum
                    ) {
                      return (
                        <option
                          key={subforum.subforum_id} // Use subforum ID as the key
                          value={subforum.name} // Use subforum name as the value
                        >
                          {subforum.name}  {/*Display subforum name */}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
            )}

            {/* Textarea for post content */}
            <Textarea
              name="body"
              placeholder="Write your post here"
              value={postContent.body}
              onChange={handleChange}
              className="mb-4 w-full"
            />
             {/* Media Preview Section */}
             {mediaPreviewURLs.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Media</h4>
                <div className="flex flex-wrap gap-2">
                  {mediaPreviewURLs.map((url, index) => (
                    <div key={index} className="relative">
                      {url.startsWith('blob:') ? (
                        // Display image preview
                        <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-300">
                          <img 
                            src={url} 
                            alt={`Media ${index + 1}`} 
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveMedia(index)}
                            className="absolute top-0 right-0 bg-white rounded-full p-0.5"
                          >
                            <XMarkIcon className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      ) : (
                        // Display file type icon for non-images
                        <div className="relative h-20 w-20 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50">
                          <div className="text-xs text-gray-500 text-center overflow-hidden">
                            {url.split('/')[1]?.toUpperCase() || 'FILE'}
                          </div>
                          <button
                            onClick={() => handleRemoveMedia(index)}
                            className="absolute top-0 right-0 bg-white rounded-full p-0.5"
                          >
                            <XMarkIcon className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add Media Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*, video/*, .pdf, .doc, .docx"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={handleAddMediaClick}
              className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-500 mb-4"
            >
              <PhotoIcon className="h-5 w-5 mr-1" />
              Add Media
            </button>
            {/* Action buttons */}
            <div className="flex justify-end">
              <Button onPress={handleCancel} className="mr-2">
                Cancel
              </Button>

              <Button
                type="submit"
                onPress={ () => {
                  if (userData.business_account) {
                    handleBusinessSubmit();
                  } else {
                    handlePersonalSubmit();
                  }
                }}
                disabled={!postContent.body.trim()}
                className="bg-blue-500 text-white px-4 py-2"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}