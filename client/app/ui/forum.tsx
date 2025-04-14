"use client";

import React, { useState, useEffect } from "react";
import parse, { DOMNode, Element } from "html-react-parser";
import Post from "./post";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

interface ForumProps {
  subforumID?: string;
}

const Forum: React.FC<ForumProps> = ({ subforumID = "1" }) => {
  const [html, setHtml] = useState<string>("");
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [user] = useAuthState(auth);

  // Function to fetch the logged-in user's ID
  const fetchLoggedInUserId = async (username: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/profile/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user ID");
      }

      const data = await response.json();
      const { profile } = data;

      if (profile && profile.user_id) {
        setLoggedInUserId(profile.user_id);
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error("Error fetching logged-in user ID:", error);
    }
  };

  // Fetch the logged-in user's ID when the component mounts
  useEffect(() => {
    if (user && user.displayName) {
      fetchLoggedInUserId(user.displayName);
    }
  }, [user]);

  const getUser = async (user_id: String) => {
    const fetchString = `http://localhost:8080/username/${user_id}`;

    const response = await fetch(fetchString, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const contentData = await response.json();
      const { username } = contentData;
      return `${username}`;
    } else {
      return "Default User";
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
    //console.log("Fetched posts from backend:", contentData.posts); // Debug log

    // Use map to handle async operations
    const posts = await Promise.all(
      contentData.posts.map(async (post: any, index: any) => {
        const { post_date, last_edit_date, body, user_id, content_id } = post;
        //console.log("Post content_id:", content_id); // Debug log
        const username = await getUser(user_id);

        // Determine if the logged-in user is the owner of the post
        const isOwner = user_id === loggedInUserId;

        // Return the HTML content for each post
        return `<post key=${index} username="${username}" date="${post_date}" editeddate="${last_edit_date}" body="${body}" contentId="${content_id}" isOwner="${isOwner}"></post>`;
      })
    );

    // Combine all post HTML content into one string
    setHtml(posts.join(""));
  };

  useEffect(() => {
    fetchPosts();
  }, [subforumID]);
  
  const parsedContent = parse(html, {
    transform: (reactNode: React.ReactNode, domNode: DOMNode) => {
      // Correctly type the domNode as Element
      if (domNode.type === "tag" && (domNode as Element).name === "post") {
        const attribs = (domNode as any).attribs || {};
        //console.log("Post attributes:", attribs); // Debug log
        const { date, editeddate, body, username, contentid } = attribs;

        //console.log("Parse content_Id:", contentid); // Debug log
        const parsedContentId = parseInt(contentid);

        return (
          <Post
            userId={loggedInUserId ?? 0}
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

  return <>{parsedContent || <p>No posts available</p>}</>;
};

export default Forum;
