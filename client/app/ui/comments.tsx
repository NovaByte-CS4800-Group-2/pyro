"use client";

import React, { useState, useEffect } from "react"; // import React and useState, useEffect hooks
import { Button } from "@heroui/react"; // Importing UI components from heroui
import { useAuthState } from "react-firebase-hooks/auth"; // Importing Firebase authentication hooks
import { auth } from "@/app/firebase/config"; // Importing Firebase configuration
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"; // Importing icons from Heroicons
import Content from "./content";

//style for small thumbs
const smallThumbsStyle = `
  .small-thumbs-vote svg {
    width: 0.875rem !important;
    height: 0.875rem !important;
    }
`;

interface Comment {
  content_id: number; // Unique identifier for the comment
  user_id: string; // User ID of the comment author4
  body: string; // Comment text
  post_date: string; // Date when the comment was posted
  last_edit_date?: string; // Added this field for edit date
  username?: string; // Username of the comment author
  subforum_id?: string; // Subforum ID (optional)
}

interface CommentsProps {
  contentId: number;
  subforumId?: string; // Optional subforum ID prop
}

const Comments: React.FC<CommentsProps> = ({ contentId, subforumId }) => {
  const [comments, setComments] = useState<Comment[]>([]); // State to hold comments
  const [comment, setComment] = useState(""); // State for new comment input
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [user] = useAuthState(auth); // Get current authenticated user
  const [userData, setUserData] = useState({
    // State to hold user data
    username: "",
    city: "",
    business_account: 0,
  });

  // State to track how many comments to show
  const [visibleComments, setVisibleComments] = useState(2); // Default to showing 2 comments

  // only 2 visible comments at a time
  const DEFAULT_VISIBLE_COMMENTS = 2;
  const COMMENTS_INCREMENT = 3; // Number of comments to show per click

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user || !user.displayName) {
          // User is not authenticated or displayName is not set
          console.log("User is not authenticated:", user);
          return;
        }

        // fetch user data from backend
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/${user.displayName}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        // if user response not okay, throw error
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          console.error("Error fetching user data:", errorData);
          throw new Error(errorData.error || "Failed to fetch user data.");
        }

        // Parse the response data
        const responseData = await userResponse.json();
        console.log("Raw user data:", responseData); // Log raw user data for debugging

        // Check if the response contains the expected data
        const { profile } = responseData;

        // set user data to state
        setUserData(profile);
        console.log("Updated userData state:", profile);
      } catch (error) {
        // Handle errors
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // Function to fetch comments with usernames
  const fetchComments = async () => {
    try {
      setIsLoading(true); // Set loading state to true
      const res = await fetch(
        // Fetch comments from backend
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/for/post/${contentId}`
      );

      // if response not okay, throw error
      if (!res.ok) {
        throw new Error(`Failed to fetch comments: ${res.status}`);
      }

      // Parse the response data
      const data = await res.json();
      console.log("Raw comments data:", data.comments); // Log raw comments data for debugging

      // Check if there are any comments
      if (!data.comments || data.comments.length === 0) {
        setComments([]); // Set comments to empty array if no comments found
        setIsLoading(false);
        return;
      }

      // Fetch usernames for each comment
      const commentsWithUsernames = await Promise.all(
        // Use Promise.all to fetch usernames concurrently
        data.comments.map(async (comment: Comment) => {
          // Map through each comment
          try {
            const response = await fetch(
              // Fetch username from backend
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/username/${comment.user_id}`
            );

            // if response not okay, throw error
            if (!response.ok) {
              throw new Error(`Failed to fetch username: ${response.status}`);
            }

            // Parse the response data
            const userData = await response.json();

            // Check if the response contains the expected data
            return {
              ...comment,
              username: userData.username || "User",
              subforum_id: subforumId, // Pass subforum ID
            };
          } catch (error) {
            // handle errors when fetching username
            console.error(
              `Error fetching username for comment ${comment.content_id}:`,
              error
            );
            return {
              ...comment,
              username: "User",
              subforum_id: subforumId,
            };
          }
        })
      );

      setComments(commentsWithUsernames); // Set comments with usernames to state

      // Reset visible comments to default when we get new data
      setVisibleComments(DEFAULT_VISIBLE_COMMENTS); // Reset visible comments to default (2)
    } catch (error) {
      // Handle errors
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch comments initially
  useEffect(() => {
    if (contentId) {
      fetchComments();
    }
  }, [contentId]);

  // Submit a new comment
  const postComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!comment.trim() || !userData.username) {
      // Check if comment is empty or user is not logged in
      console.error("Comment cannot be empty or user is not logged in");
      return;
    }
    console.log("Request body for postComment:", {
      subforum_id: subforumId, // Subforum ID
      username: userData.username, // User's username
      body: comment, // Comment body
      post_id: contentId, // ID of the post being commented on
    });

    const cityValue = subforumId;

    console.log("City value:", cityValue); // Log city value for debugging
    //check if user is logged in
    try {
      console.log("Posting comment as:", userData.username);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/createComment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: cityValue, // User's city
            username: userData.username, // User's username
            body: comment, // Comment body
            post_id: contentId, // ID of the post being commented on
          }),
        }
      );

      console.log("Subforum ID:", subforumId);
      // parse the response data
      const data = await res.json();

      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/send/comment/notification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_id: data.id,
            username: userData.username,
          }),
        }
      );

      const regex = /@([\w.-]+)/g; // regex to search for the @'s
      const matches = [...comment.matchAll(regex)].map(match => match[1]); // extract the names from the @'s

      if(matches.length !== 0)
      {
        const requestBody = {
          content_id: data.id, 
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

      // if response okay, set comment to empty string and fetch comments again
      if (res.ok) {
        console.log("Comment successfully posted!");
        setComment(""); // Clear comment input
        fetchComments(); // Refresh comments
      } else {
        // Handle errors
        console.error("Failed to post comment:", await res.text());
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  // Handle "Show more" button click
  const handleShowMore = () => {
    // Increment the visible comments by COMMENTS_INCREMENT
    setVisibleComments((prevVisible) =>
      Math.min(prevVisible + COMMENTS_INCREMENT, comments.length)
    );
  };

  // Handle "Show less" button click
  const handleShowLess = () => {
    // Collapse back to the default number of comments
    setVisibleComments(DEFAULT_VISIBLE_COMMENTS);
  };

  // Get limited comments based on visibleComments state
  const displayedComments = comments.slice(0, visibleComments); // Slice comments array to get only the visible comments
  const hasMoreComments = comments.length > visibleComments; // Check if there are more comments to show
  const isExpanded = visibleComments > DEFAULT_VISIBLE_COMMENTS; // Check if comments are expanded

  // render comments section
  return (
    <div className="mt-4">
      <style>{smallThumbsStyle}</style> {/* Apply small thumbs style */}
      {/* Comments Section - Indented from the post */}
      <div className="pl-4 ml-2 border-l-2 border-gray-200">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading comments...</p> // Loading state
        ) : comments.length > 0 ? (
          <>
            {displayedComments.map(
              (
                comment // Map through comments
              ) => (
                <Content
                  key={comment.content_id}
                  userId={user?.uid || ""}
                  posterId={comment.user_id}
                  username={comment.username || "User"}
                  contentType="comment"
                  contentId={comment.content_id}
                  body={comment.body}
                  postDate={comment.post_date}
                  lastEditDate={comment.last_edit_date || ""}
                  isOwner={user?.uid === comment.user_id}
                  isVerified={true}
                  subforumId={subforumId} // Pass subforum ID to Content component
                  onUpdateContent={() => {
                    fetchComments(); // Fetch comments after updating
                  }}
                  onDeleteContent={() => {
                    // Delete a comment

                    fetchComments();
                  }}
                />
              )
            )}

            {/* Comment expand/collapse controls */}
            <div className="mt-3 flex justify-between">
              {/* Show more comments button */}
              {hasMoreComments && (
                <button
                  className="text-sm text-grey-400 hover:text-blue-400 font-small flex items-center"
                  onClick={handleShowMore} // Show more comments on click
                >
                  <ChevronDownIcon className="w-4 h-4 mr-1" />
                  Show{" "}
                  {Math.min(
                    COMMENTS_INCREMENT,
                    comments.length - visibleComments
                  )}{" "}
                  more{" "}
                  {/* Show the number of comments that will be displayed */}
                  {Math.min(
                    COMMENTS_INCREMENT,
                    comments.length - visibleComments
                  ) === 1
                    ? "comment"
                    : "comments"}
                </button>
              )}

              {/* Show less button - only visible when expanded */}
              {isExpanded && (
                <button
                  className="text-sm text-grey-300 hover:text-blue-300 font-small flex items-center"
                  onClick={handleShowLess} // Show less comments on click
                >
                  <ChevronUpIcon className="w-4 h-4 mr-1" />
                  Show less
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">No comments yet.</p> // No comments state
        )}

        {/* Leave a Comment */}
        {user ? (
          <form onSubmit={postComment} className="mt-6 relative">
            {" "}
            {/* Form for posting a comment */}
            <div className="relative">
              <textarea
                name="comment"
                className="w-full border rounded-md p-1 text-sm pr-12"
                placeholder="Leave a comment..."
                value={comment} // Controlled input for comment
                onChange={(e) => setComment(e.target.value)} // Update comment state on change
              />
              <Button // Submit button for posting comment
                type="submit"
                className="absolute right-1 top-2 text-xs p-0 leading-none"
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  padding: "0 2px",
                  lineHeight: "1rem",
                  height: "2rem",
                  minHeight: "2rem",
                }}
                disabled={!userData.username} // Disable button if user is not logged in
              >
                {userData.username ? "Submit" : "Loading..."}{" "}
                {/* Show loading state if user is not logged in */}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            Please log in to comment. {/* Prompt to log in */}
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
