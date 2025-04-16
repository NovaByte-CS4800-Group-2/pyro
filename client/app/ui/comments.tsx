"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { ChatBubbleLeftIcon, ShareIcon, EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Vote from "./vote";

const smallThumbsStyle = `
  .small-thumbs-vote svg {
    width: 0.875rem !important;
    height: 0.875rem !important;
    }
`;

interface Comment {
  content_id: number;
  user_id: string;
  body: string;
  post_date: string;
  last_edit_date?: string;  // Added this field for edit date
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
    username: "",
    city: "",
    business_account: 0,
  });

  // State to track how many comments to show
  const [visibleComments, setVisibleComments] = useState(2);

  // States for comment editing and deletion
  const [activeComment, setActiveComment] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);
  const [editedBody, setEditedBody] = useState("");
  
  // Constants
  const DEFAULT_VISIBLE_COMMENTS = 2;

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/${user.displayName}`,
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

  // Function to fetch comments with usernames
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/for/post/${contentId}`
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
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/username/${comment.user_id}`
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

      setComments(commentsWithUsernames);
      // Reset visible comments to default when we get new data
      setVisibleComments(DEFAULT_VISIBLE_COMMENTS);
    } catch (error) {
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
      console.error("Comment cannot be empty or user is not logged in");
      return;
    }

    try {
      console.log("Posting comment as:", userData.username);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/createComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: "Burbank",
          username: userData.username,
          body: comment,
          post_id: contentId,
        }),
      });

      if (res.ok) {
        console.log("Comment successfully posted!");
        setComment(""); // Clear comment input
        fetchComments(); // Refresh comments
      } else {
        console.error("Failed to post comment:", await res.text());
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async () => {
    if (!currentCommentId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/deleteComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment_id: currentCommentId,
        }),
      });

      if (res.ok) {
        console.log("Comment successfully deleted!");
        setDeleteModalOpen(false);
        fetchComments(); // Refresh comments
      } else {
        console.error("Failed to delete comment:", await res.text());
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // Edit a comment
  const handleEditComment = async () => {
    if (!currentCommentId || !editedBody.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/editComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_id: currentCommentId,
          newBody: editedBody,
        }),
      });

      if (res.ok) {
        console.log("Comment successfully edited!");
        setEditModalOpen(false);
        fetchComments(); // Refresh comments
      } else {
        console.error("Failed to edit comment:", await res.text());
      }
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  // Toggle comment menu
  const toggleCommentMenu = (commentId: number) => {
    setActiveComment(activeComment === commentId ? null : commentId);
  };

  // Open edit modal
  const openEditModal = (comment: Comment) => {
    setCurrentCommentId(comment.content_id);
    setEditedBody(comment.body);
    setEditModalOpen(true);
    setActiveComment(null); // Close the menu
  };

  // Open delete modal
  const openDeleteModal = (commentId: number) => {
    setCurrentCommentId(commentId);
    setDeleteModalOpen(true);
    setActiveComment(null); // Close the menu
  };

  // Handle "Show more" button click
  const handleShowMore = () => {
    // Show all comments
    setVisibleComments(comments.length);
  };

  // Handle "Show less" button click
  const handleShowLess = () => {
    // Collapse back to default number of comments
    setVisibleComments(DEFAULT_VISIBLE_COMMENTS);
  };

  // Get limited comments based on visibleComments state
  const displayedComments = comments.slice(0, visibleComments);
  const hasMoreComments = comments.length > visibleComments;
  const isExpanded = visibleComments > DEFAULT_VISIBLE_COMMENTS;

  // Format comment date for display
  const formatCommentDate = (comment: Comment) => {
    const postDate = comment.post_date ? comment.post_date.replace("T07:00:00.000Z", "") : "";
    const editDate = comment.last_edit_date && comment.last_edit_date !== "null" 
      ? comment.last_edit_date.replace("T07:00:00.000Z", "")
      : "";
    
    if (editDate) {
      return `Edited: ${editDate}`;
    } else {
      return `Posted: ${postDate}`;
    }
  };

  return (
    <div className="mt-4">
      <style>{smallThumbsStyle}</style>
      {/* Post Interaction Bar - This clearly belongs to the post */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-4 pt-2">
      <Vote contentId={contentId} userId={Number(userData.user_id)} />
        <div className="flex items-center space-x-6">
          {user && (
            <div className="flex items-center gap-1 hover:text-black cursor-pointer">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span>Comments</span>
            </div>)}
          <div className="flex items-center gap-1 hover:text-black cursor-pointer">
            <ShareIcon className="w-4 h-4" />
            <span>Share</span>
          </div>
        </div>
      </div>
      
      {/* Comments Section - Indented from the post */}
      <div className="pl-4 ml-2 border-l-2 border-gray-200">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : comments.length > 0 ? (
          <>
            {displayedComments.map((comment) => (
              <div
                key={comment.content_id}
                className="border-t border-gray-200 pt-2 mt-2 text-sm text-gray-700 relative"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{comment.username}</p>
                    <p className="text-xs text-gray-500">
                      • {formatCommentDate(comment)}
                    </p>
                  </div>
                  
                  {/* Comment Menu (visible only to the comment owner) */}
                  {user?.uid === comment.user_id && (
                    <div className="relative">
                      <EllipsisVerticalIcon
                        className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={() => toggleCommentMenu(comment.content_id)}
                      />
                      
                      {activeComment === comment.content_id && (
                        <div className="absolute right-0 mt-2 bg-white border shadow-md rounded-md z-20 p-2">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => openEditModal(comment)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            onClick={() => openDeleteModal(comment.content_id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Comment content */}
                <p className="mt-1 mb-2 text-base">{comment.body}</p>
                
                {/* Comment voting - clearly belongs to the comment */}
                <div className="flex justify-start items-center text-xs text-gray-500 mt-1 small-thumbs-vote">
                <Vote contentId={comment.content_id} userId={Number(userData.user_id)} />
                </div>
              </div>
            ))}

            {/* Comment expand/collapse controls */}
            <div className="mt-3 flex justify-between">
              {/* Show more comments button */}
              {hasMoreComments && (
                <button
                  className="text-sm text-grey-400 hover:text-blue-400 font-small flex items-center"
                  onClick={handleShowMore}
                >
                  <ChevronDownIcon className="w-4 h-4 mr-1" />
                  Show {comments.length - visibleComments} more {comments.length - visibleComments === 1 ? 'comment' : 'comments'}
                </button>
              )}
              
              {/* Show less button - only visible when expanded */}
              {isExpanded && (
                <button
                  className="text-sm text-grey-300 hover:text-blue-300 font-small flex items-center"
                  onClick={handleShowLess}
                >
                  <ChevronUpIcon className="w-4 h-4 mr-1" />
                  Show less
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}

        {/* Leave a Comment */}
        {user && (
        <form onSubmit={postComment} className="mt-6 relative">
          <div className="relative">
            <textarea
              name="comment"
              className="w-full border rounded-md p-1 text-sm pr-12"
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
              }}
              disabled={!userData.username}
            >
              {userData.username ? "Submit" : "Loading..."}
            </Button>
          </div>
        </form>
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
                    handleEditComment();
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
                    handleDeleteComment();
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