"use client";

import React, { useState, useEffect } from "react";
import parse, { DOMNode, Element } from "html-react-parser";
import Post from "./post";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { getServerSideProps } from "next/dist/build/templates/pages";
import SearchBar from "./searchbar";

interface ForumProps {
  // Define the props for the Forum component
  subforumID?: string;
  userID?: string;
}

const Forum: React.FC<ForumProps> = ({ subforumID = "1", userID = "-1" }) => {
  //// Define the Forum component
  const [html, setHtml] = useState<string>(""); // State to manage the HTML content
  const [user] = useAuthState(auth); // Get the current authenticated user
  const [search, setSearch] = useState("");

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

    if (!response.ok) {
      setHtml("<p>Error loading posts :(</p>");
      return;
    }

    const contentData = await response.json();
    //console.log("Fetched posts from backend:", contentData.posts); // Debug log
    const searchLower = search.toLowerCase();

    // Use map to handle async operations
    const posts = await Promise.all(
      contentData.posts.map(async (post: any, index: any) => {
        const { post_date, last_edit_date, body, user_id, content_id } = post;
        //console.log("Post content_id:", content_id); // Debug log
        const username = await getUser(user_id);

        // Determine if the logged-in user is the owner of the post
        const isOwner = user_id === user?.uid;

        // Filter posts that do not match the search in either username or body
        const bodyMatch = body.toLowerCase().includes(searchLower);
        const userMatch = username.toLowerCase().includes(searchLower);

        if (!bodyMatch && !userMatch) return null; // Skip this post if no match

        // Return the HTML content for each post
        return `<post key=${index} posterid="${user_id}" username="${username}" date="${post_date}" editeddate="${last_edit_date}" body="${body}" contentId="${content_id}" isOwner="${isOwner}"></post>`;
      })
    );

    // Combine all post HTML content into one string, filtering out nulls
    setHtml(posts.filter(Boolean).join(""));
  };

  useEffect(() => {
    fetchPosts();
  }, [subforumID, user?.uid, search]);

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
            postDate={date}
            lastEditDate={editeddate}
            subforumId={subforumID}
            body={body}
            search={search}
            contentId={parsedContentId}
            isVerified={true}
            isOwner={attribs.isowner === "true"}
            onRefresh={fetchPosts} // Pass the fetchPosts function to refresh the posts
            contentType="post" // Provide a default contentType
            onUpdateContent={(updatedContent) => {
              console.log("Content updated:", updatedContent);
            }} // Provide a handler for updating content
            onDeleteContent={() => {
              console.log("Content deleted");
            }} // Provide a handler for deleting content
          />
        );
      }
    },
  });

  return (
    <div className="space-y-4">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by username or text..."
      />
      {parsedContent || <p>No posts available</p>}
    </div>
  );
};

export default Forum;
