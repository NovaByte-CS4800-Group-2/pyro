"use client";

import React, { useState, useEffect } from "react"; // Import React and hooks
import parse, { DOMNode, Element } from "html-react-parser"; // Import html-react-parser for parsing HTML strings
import Post from "./post"; // Import Post component
import { useAuthState } from "react-firebase-hooks/auth"; // Import Firebase authentication hooks
import { auth } from "@/app/firebase/config"; // Import Firebase configuration

interface ForumProps {
  // Define the props for the Forum component
  subforumID?: string;
  userID?: string;
}

const Forum: React.FC<ForumProps> = ({ subforumID = "1", userID = "-1" }) => {
  //// Define the Forum component
  const [html, setHtml] = useState<string>(""); // State to manage the HTML content
  const [user] = useAuthState(auth); // Get the current authenticated user

  const getUser = async (user_id: String) => {
    // Function to fetch the username based on user ID
    const fetchString = `${process.env.NEXT_PUBLIC_BACKEND_URL}/username/${user_id}`;

    const response = await fetch(fetchString, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      // Check if the response is OK
      const contentData = await response.json(); // Parse the response data
      const { username } = contentData; // Extract the username from the response
      return `${username}`;
    } else {
      return "Default User"; // Return a default username if the fetch fails
    }
  };

  const deletePost = async (contentId: number) => {
    // Function to delete a post
    console.log("Deleting post with contentId:", contentId); // Debug log
    try {
      // Fetch the delete endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content_id: contentId }), // Send the content ID in the request body
        }
      );

      if (!response.ok) {
        // if response not okay, throw an error
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete post.");
      }

      console.log("Post deleted successfully!"); // Debug log
      fetchPosts(); // Refresh posts after deletion
    } catch (error: any) {
      //handle errors
      console.error("Error deleting post:", error.message);
    }
  };

  const onEditPost = async (contentId: number, newBody: string) => {
    // Function to edit a post
    console.log(
      "Editing post with contentId:",
      contentId,
      "New body:",
      newBody
    ); // Debug log
    try {
      // Fetch the edit endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/post/edit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content_id: contentId, newBody: newBody }), // Send the content ID and new body in the request body
        }
      );

      if (!response.ok) {
        // if response not okay, throw an error
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit post.");
      }

      console.log("Post edited successfully!");
      fetchPosts(); // Refresh posts after editing
    } catch (error: any) {
      //handle errors
      console.error("Error editing post:", error.message);
    }
  };

  const fetchPosts = async () => {
    // Function to fetch posts from the backend
    let fetchString = `${process.env.NEXT_PUBLIC_BACKEND_URL}/post/${subforumID}`;

    if (userID !== "-1") {
      // If userID is provided, fetch posts for that user
      fetchString = `${process.env.NEXT_PUBLIC_BACKEND_URL}/userPosts/${userID}`;
    }

    const response = await fetch(fetchString, {
      // Fetch posts from the backend
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if response not okay, set error message
    if (!response.ok) {
      setHtml("<p>Error loading posts :(</p>");
      return;
    }

    // Parse the response data
    const contentData = await response.json();

    // Use map to handle async operations
    const posts = await Promise.all(
      contentData.posts.map(async (post: any, index: any) => {
        // Map through the posts
        const { post_date, last_edit_date, body, user_id, content_id } = post; // Destructure post data
        const username = await getUser(user_id); // Fetch the username based on user ID

        // Determine if the logged-in user is the owner of the post
        const isOwner = user_id === user?.uid;

        // Return the HTML content for each post
        return `<post key=${index} posterid="${user_id}" username="${username}" date="${post_date}" editeddate="${last_edit_date}" body="${body}" contentId="${content_id}" isOwner="${isOwner}"></post>`;
      })
    );

    // Combine all post HTML content into one string
    setHtml(posts.join(""));
  };

  useEffect(() => {
    if (user?.uid != null) {
      fetchPosts();
    }
  }, [subforumID, user?.uid]); // Fetch posts when the component mounts or when subforumID or user ID changes

  const parsedContent = parse(html, {
    // Parse the HTML string
    transform: (reactNode: React.ReactNode, domNode: DOMNode) => {
      // Correctly type the domNode as Element
      if (domNode.type === "tag" && (domNode as Element).name === "post") {
        const attribs = (domNode as any).attribs || {};
        // console.log("Post attributes:", attribs); // Debug log
        const { date, editeddate, body, username, contentid, posterid } =
          attribs;

        // console.log("Parse content_Id:", contentid); // Debug log
        const parsedContentId = parseInt(contentid);
        return (
          <Post // Render the Post component
            // Pass the attributes to the Post component
            userId={user?.uid ?? ""}
            posterId={posterid}
            key={parsedContentId}
            username={username}
            date={date}
            editeddate={editeddate}
            body={body}
            contentId={parsedContentId}
            isVerified={true}
            isOwner={attribs.isowner === "true"}
            onDeletePost={() => deletePost(parsedContentId)}
            onEditPost={(contentId: number, newBody: string) =>
              onEditPost(contentId, newBody)
            }
          />
        );
      }
    },
  });

  return <>{parsedContent || <p>No posts available</p>}</>; // Render the parsed content or a message if no posts are available
};

export default Forum;
