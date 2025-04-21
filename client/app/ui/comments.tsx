"use client";

import React, { useState, useEffect } from "react"; // import React and useState, useEffect hooks
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react"; // Importing UI components from heroui
import { useAuthState } from "react-firebase-hooks/auth"; // Importing Firebase authentication hooks
import { auth } from "@/app/firebase/config"; // Importing Firebase configuration
import {
  EllipsisVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline"; // Importing icons from Heroicons
import Vote from "./vote"; // Importing Vote component for voting functionality

//style for small thumbs
const smallThumbsStyle = `
  .small-thumbs-vote svg {
    width: 0.875rem !important;
    height: 0.875rem !important;
    }
`;

interface Comment {
  content_id: number; // Unique identifier for the comment
  user_id: string; // User ID of the comment author
  body: string; // Comment text
  post_date: string; // Date when the comment was posted
  last_edit_date?: string; // Added this field for edit date
  username?: string; // Username of the comment author
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

  // States for comment editing and deletion
  const [activeComment, setActiveComment] = useState<number | null>(null); // State to track which comment menu is active
  const [editModalOpen, setEditModalOpen] = useState(false); // State to control edit modal visibility
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State to control delete modal visibility
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null); // State to hold the ID of the current comment being edited or deleted
  const [editedBody, setEditedBody] = useState(""); // State to hold the edited comment body

  // only 2 visible comments at a time
  const DEFAULT_VISIBLE_COMMENTS = 2;

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
          `http://localhost:8080/profile/${user.displayName}`,
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
            };
          } catch (error) {
            // handle errors when fetching username
            console.error(
              `Error fetching username for comment ${comment.content_id}:`,
              error
            );
            return { ...comment, username: "User" };
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
    

    //check if user is logged in
    try {
      console.log("Posting comment as:", userData.username);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/createComment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: subforumId, // User's city 
            username: userData.username, // User's username
            body: comment, // Comment body
            post_id: contentId, // ID of the post being commented on
          }),
        }
      );

      // parse the response data
      const data = await res.json();

      
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send/comment/notification`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_id: data.id,
          username: userData.username,
        }),
      });

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

  // Delete a comment
  const handleDeleteComment = async () => {
    if (!currentCommentId) return; // Check if currentCommentId is set

    try {
      const res = await fetch(
        // Send request to delete comment
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/deleteComment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comment_id: currentCommentId, // ID of the comment to delete
          }),
        }
      );

      await fetch(
        // Send request to remove notification
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/remove/notification/${currentCommentId}/${"comment"}`,
        {
          method: "DELETE",
        }
      );

      // if response okay, set currentCommentId to null and fetch comments again
      if (res.ok) {
        console.log("Comment successfully deleted!");
        setDeleteModalOpen(false);
        fetchComments(); // Refresh comments
      } else {
        // Handle errors
        console.error("Failed to delete comment:", await res.text());
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // Edit a comment
  const handleEditComment = async () => {
    // Check if currentCommentId and editedBody are set
    if (!currentCommentId || !editedBody.trim()) return; // Check if editedBody is empty

    try {
      const res = await fetch(
        // Send request to edit comment
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/editComment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_id: currentCommentId, // ID of the comment to edit
            newBody: editedBody, // New comment body
          }),
        }
      );

      // if response okay, set currentCommentId and editedBody to null and fetch comments again
      if (res.ok) {
        console.log("Comment successfully edited!");
        setEditModalOpen(false);
        fetchComments(); // Refresh comments
      } else {
        // Handle errors
        console.error("Failed to edit comment:", await res.text());
      }
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  // Toggle comment menu
  const toggleCommentMenu = (commentId: number) => {
    // Check if the comment menu is already open
    setActiveComment(activeComment === commentId ? null : commentId); // Set the active comment ID
  };

  // Open edit modal
  const openEditModal = (comment: Comment) => {
    // Check if the comment is editable
    setCurrentCommentId(comment.content_id); // Set the current comment ID
    setEditedBody(comment.body); // Set the edited body to the current comment body
    setEditModalOpen(true); // Open the edit modal
    setActiveComment(null); // Close the menu
  };

  // Open delete modal
  const openDeleteModal = (commentId: number) => {
    // Check if the comment is deletable
    setCurrentCommentId(commentId); // Set the current comment ID
    setDeleteModalOpen(true); // Open the delete modal
    setActiveComment(null); // Close the menu
  };

  // Handle "Show more" button click
  const handleShowMore = () => {
    // Check if there are more comments to show
    // Show all comments
    setVisibleComments(comments.length);
  };

  // Handle "Show less" button click
  const handleShowLess = () => {
    // Check if the comments are expanded
    // Collapse back to default number of comments
    setVisibleComments(DEFAULT_VISIBLE_COMMENTS); // Reset to default (2)
  };

  // Get limited comments based on visibleComments state
  const displayedComments = comments.slice(0, visibleComments); // Slice comments array to get only the visible comments
  const hasMoreComments = comments.length > visibleComments; // Check if there are more comments to show
  const isExpanded = visibleComments > DEFAULT_VISIBLE_COMMENTS; // Check if comments are expanded

  // Format comment date for display
  const formatCommentDate = (comment: Comment) => {
    const postDate = comment.post_date // Get post date from comment
      ? comment.post_date.replace("T07:00:00.000Z", "")
      : ""; // Format post date
    const editDate = // Get last edit date from comment
      comment.last_edit_date && comment.last_edit_date !== "null"
        ? comment.last_edit_date.replace("T07:00:00.000Z", "")
        : ""; // Format edit date

    if (editDate) {
      // Check if the comment has been edited
      return `Edited: ${editDate}`; // Format edit date
    } else {
      return `Posted: ${postDate}`; // Format post date
    }
  };

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
                <div
                  key={comment.content_id} // Unique key for each comment
                  className="border-t border-gray-200 pt-2 mt-2 text-sm text-gray-700 relative"
                >
                  <div className="flex justify-between items-start">
                    {" "}
                    {/* Flex container for comment header */}
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{comment.username}</p>{" "}
                      {/* Display username */}
                      <p className="text-xs text-gray-500">
                        • {formatCommentDate(comment)}{" "}
                        {/* Display formatted date */}
                      </p>
                    </div>
                    {/* Comment Menu (visible only to the comment owner) */}
                    {user?.uid === comment.user_id && ( // Check if the current user is the comment owner
                      <div className="relative">
                        <EllipsisVerticalIcon // Icon for comment menu
                          className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                          onClick={() => toggleCommentMenu(comment.content_id)} // Toggle menu on click
                        />

                        {activeComment === comment.content_id && ( // Check if the menu is active
                          <div className="absolute right-0 mt-2 bg-white border shadow-md rounded-md z-20 p-2">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => openEditModal(comment)} // Open edit modal on click
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                              onClick={() =>
                                openDeleteModal(comment.content_id)
                              } // Open delete modal on click
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Comment content */}
                  <p className="mt-1 mb-2 text-base">{comment.body}</p>{" "}
                  {/* Display comment body */}
                  {/* Comment voting - clearly belongs to the comment */}
                  <div className="flex justify-start items-center text-xs text-gray-500 mt-1 small-thumbs-vote">
                    <Vote
                      contentId={comment.content_id} // ID of the comment
                      userId={user?.uid || ""} // User ID of the current user
                      username={user?.displayName || ""} // Username of the current user
                    />
                  </div>
                </div>
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
                  Show {comments.length - visibleComments} more{" "}
                  {/* Show remaining comments count */}
                  {comments.length - visibleComments === 1
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
      {/* Edit Comment Modal */}
      <Modal isOpen={editModalOpen} onOpenChange={setEditModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Comment</ModalHeader>
              <ModalBody>
                <textarea
                  className="w-full border rounded-md p-2"
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => {
                    handleEditComment(); // Call edit comment function
                    onClose();
                  }}
                >
                  Save
                </Button>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Delete Comment Modal */}
      <Modal isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Comment</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this comment?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => {
                    handleDeleteComment(); // Call delete comment function
                    onClose();
                  }}
                >
                  Delete
                </Button>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Comments;
