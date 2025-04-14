"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { ChatBubbleLeftIcon, ShareIcon } from "@heroicons/react/24/outline";
import Vote from "./vote";

interface Comment {
  content_id: number;
  user_id: number;
  body: string;
  post_date: string;
  username?: string;
}

interface CommentsProps {
  contentId: number;
}

const Comments: React.FC<CommentsProps> = ({ contentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState({
    user_id: 0,
    username: "",
    city: "",
    business_account: 0,
  });

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user || !user.displayName) {
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
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // Fetch comments with usernames
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://localhost:8080/comments/for/post/${contentId}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch comments: ${res.status}`);
        }

        const data = await res.json();
        console.log("Raw comments data:", data.comments);

        if (!data.comments || data.comments.length === 0) {
          setComments([]);
          setIsLoading(false);
          return;
        }

        // Fetch usernames for each comment
        const commentsWithUsernames = await Promise.all(
          data.comments.map(async (comment: Comment) => {
            try {
              // We need to fetch username for each comment's user_id
              const response = await fetch(
                `http://localhost:8080/username/${comment.user_id}`
              );

              if (!response.ok) {
                throw new Error(`Failed to fetch username: ${response.status}`);
              }

              const userData = await response.json();
              console.log(
                `User data for comment ${comment.content_id}:`,
                userData
              );

              return {
                ...comment,
                username: userData.username || "User", // Fallback to "User" if no username
              };
            } catch (error) {
              console.error(
                `Error fetching username for comment ${comment.content_id}:`,
                error
              );
              return { ...comment, username: "User" }; // Use "User" as fallback
            }
          })
        );

        setComments(commentsWithUsernames);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (contentId) {
      fetchComments();
    }
  }, [contentId]);

  // Submit a new comment
  const postComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!comment.trim() || !userData.username) {
      console.error("Comment cannot be empty or user is not logged in");
      return;
    }

    try {
      console.log("Posting comment as:", userData.username);

      const res = await fetch(`http://localhost:8080/createComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: "Burbank", // Using the hardcoded value that worked before
          username: userData.username, // Use actual username from profile
          body: comment,
          post_id: contentId,
        }),
      });

      if (res.ok) {
        console.log("Comment successfully posted!");
        setComment(""); // Clear comment input

        // Re-fetch comments to update list
        const fetchRes = await fetch(
          `http://localhost:8080/comments/for/post/${contentId}`
        );

        if (!fetchRes.ok) {
          throw new Error(
            `Failed to fetch updated comments: ${fetchRes.status}`
          );
        }

        const fetchData = await fetchRes.json();

        // Fetch usernames for the updated comments
        const updatedCommentsWithUsernames = await Promise.all(
          (fetchData.comments || []).map(async (comment: Comment) => {
            try {
              const response = await fetch(
                `http://localhost:8080/username/${comment.user_id}`
              );

              if (!response.ok) {
                throw new Error(`Failed to fetch username: ${response.status}`);
              }

              const userData = await response.json();
              return {
                ...comment,
                username: userData.username || "User",
              };
            } catch (error) {
              console.error(
                `Error fetching username for comment ${comment.content_id}:`,
                error
              );
              return { ...comment, username: "User" };
            }
          })
        );

        setComments(updatedCommentsWithUsernames);
      } else {
        console.error("Failed to post comment:", await res.text());
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <div className="mt-4">
      {/* Comments Section */}
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length > 0 ? (
        comments.map((comment, index) => (
          <div
            key={index}
            className="border-t border-gray-200 pt-2 mt-2 text-sm text-gray-700"
          >
            <p className="font-semibold">{comment.username}</p>
            <p className="text-xs text-gray-500">
              {comment.post_date
                ? comment.post_date.replace("T07:00:00.000Z", "")
                : ""}
            </p>
            <p>{comment.body}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}

      {/* Interaction Bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
        <Vote contentId={contentId} userId={userData.user_id} />
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-1 hover:text-black cursor-pointer">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span>Comments</span>
          </div>
          <div className="flex items-center gap-1 hover:text-black cursor-pointer">
            <ShareIcon className="w-4 h-4" />
            <span>Share</span>
          </div>
        </div>
      </div>

      {/* Leave a Comment */}
      {user ? (
        <form onSubmit={postComment} className="mt-4 relative">
          <div className="relative">
            <textarea
              name="comment"
              className="w-full border rounded-md p-1 text-sm pr-12" // Add padding-right for the button
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              type="submit"
              className="absolute right-1 top-2 text-xs p-0 leading-none"
              style={{
                backgroundColor: "grey",
                color: "white",
                padding: "0 2px",
                lineHeight: "1rem",
                height: "2rem",
                minHeight: "2rem",
                
              }} // Position the button inside the text box
              disabled={!userData.username}
            >
              {userData.username ? "Submit" : "Loading..."}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mt-4">Please log in to comment.</p>
      )}
    </div>
  );
};

export default Comments;
