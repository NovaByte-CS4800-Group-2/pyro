"use client";

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import parse, { DOMNode, Element } from "html-react-parser";
import Post from "./post";

interface ForumProps {
  subforumID?: string;
}

const Forum: React.FC<ForumProps> = ({ subforumID = "1" }) => {
  const [html, setHtml] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false); // Track user verification status
  const [user] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<string>("Default User");

  // Fetch the current user's verification status
  const fetchUserVerification = async () => {
    try {
      if (!user || !user.displayName) {
        console.error("User is not logged in or displayName is missing.");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/profile/${user.displayName}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setIsVerified(userData.verified);
        setCurrentUser(userData.username); // Set the current user's username
      } else {
        console.error("Failed to fetch user verification status.");
      }
    } catch (error) {
      console.error("Error fetching user verification status:", error);
    }
  };

  const deletePost = async (contentId: number) => {
    console.log("Deleting post with contentId:", contentId); // Debug log
    try {
      const response = await fetch("http://localhost:8080/post/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: contentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete post.");
      }

      console.log("Post deleted successfully!");
      fetchPosts(); // Refresh posts after deletion
    } catch (error: any) {
      console.error("Error deleting post:", error.message);
    }
  };

  const onEditPost = async (contentId: number, newBody: string) => {
    console.log(
      "Editing post with contentId:",
      contentId,
      "New body:",
      newBody
    ); // Debug log
    try {
      const response = await fetch("http://localhost:8080/post/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: contentId, newBody: newBody }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit post.");
      }

      console.log("Post edited successfully!");
      fetchPosts(); // Refresh posts after editing
    } catch (error: any) {
      console.error("Error editing post:", error.message);
    }
  };

  const fetchPosts = async () => {
    const fetchString = `http://localhost:8080/post/${subforumID}`;

    const response = await fetch(fetchString, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setHtml("<p>Error loading posts :(</p>");
      return;
    }

    const contentData = await response.json();
    console.log("Fetched posts from backend:", contentData.posts); // Debug log

    // Use map to handle async operations
    const posts = await Promise.all(
      contentData.posts.map(async (post: any, index: any) => {
        const { post_date, last_edit_date, body, user_id, content_id } = post;
        console.log("Post content_id:", content_id); // Debug log
        const username = currentUser;

        // Return the HTML content for each post
        return `<post key=${index} username="${username}" date="${post_date}" editeddate="${last_edit_date}" body="${body}" contentId="${content_id}"></post>`;
      })
    );

    // Combine all post HTML content into one string
    setHtml(posts.join(""));
  };

  useEffect(() => {
    fetchUserVerification(); // Fetch verification status on component mount
    fetchPosts(); // Fetch posts
  }, [subforumID]);

  const parsedContent = parse(html, {
    transform: (reactNode: React.ReactNode, domNode: DOMNode) => {
      // Correctly type the domNode as Element
      if (domNode.type === "tag" && (domNode as Element).name === "post") {
        const attribs = (domNode as any).attribs || {};
        console.log("Post attributes:", attribs); // Debug log
        const { date, editeddate, body, username, contentid } = attribs;

        console.log("Parse content_Id:", contentid); // Debug log
        const parsedContentId = parseInt(contentid);

        return (
          <Post
            key={parsedContentId}
            username={username}
            date={date}
            editeddate={editeddate}
            body={body}
            contentId={parsedContentId}
            isVerified={isVerified}
            isOwner={user?.displayName === username}
            onDeletePost={() => deletePost(parsedContentId)} // Pass the deletePost function
            onEditPost={(contentId: number, newBody: string) =>
              onEditPost(contentId, newBody)
            } // Pass the editPost function
          />
        );
      }
    },
  });

  return <>{parsedContent || <p>No posts available</p>}</>;
};

export default Forum;
