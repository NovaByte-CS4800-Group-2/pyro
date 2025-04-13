import "@/app/globals.css";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { use, useEffect, useState } from "react";

interface PostProps {
  username: string;
  date: string;
  editeddate: string;
  body: string;
  contentId: number;
  isVerified: boolean;
  isOwner: boolean;
  onDeletePost: (contentId: number) => void;
  onEditPost: (contentId: number, newBody: string) => void;
}

export default function Post({
  username = "Default User",
  date = "",
  editeddate = "",
  body = "",
  contentId = 0,
  isVerified = false,
  isOwner = false,
  onDeletePost,
  onEditPost,
}: PostProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedBody, setEditedBody] = useState(body);
  const formattedDate = date.replace("T07:00:00.000Z", "");
  const formattedEditDate =
    editeddate === "null" ? "" : editeddate.replace("T07:00:00.000Z", "");
  const [comment, setComment] = useState("")
  const [newComment, setNewComment] = useState();
  const [refreshComments, setRefreshComments] = useState("")


  const handleDelete = async () => {
    onDeletePost(contentId);
    setIsDeleteModalOpen(false);
    try {
      const res = await fetch(`http://localhost:8080/deleteComment}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body:  JSON.stringify({
          comment_id: contentId})
      })
    } catch (e){
      console.log("Could not delete comment:", e)
    }
  };

  const handleEdit = async () => {
    onEditPost(contentId, editedBody);
    setIsEditModalOpen(false);
  };

  // const getCommentsData(contentId) {
  //   console.log("hello")
  // }
  
  const showComments = async () => {
    console.log("postID:", contentId)
      try {
        const res = await fetch(`http://localhost:8080/comments/for/post/${contentId}`);
        const data = await res.json();
        if (data.comments == ""){
          console.log("No comments to display")
        } else {
          const comments = data.comments;
          comments.forEach((comment: { 
            body: "", 
            last_edit_date: "",
            post_date: "", 
            subforum_id: 0
            user_id: 0}) => {

            console.log("Updated Comment Data Body:", comment.body);
            console.log("Last Edit Date:", comment.last_edit_date);
            console.log("Post Date:", comment.post_date);
            console.log("Subforum ID:", comment.subforum_id);

          });}
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
  }
  

  const postComment = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Comment:", comment);
    setComment(comment);
    try{
      const res = await fetch(`http://localhost:8080/createComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body:  JSON.stringify({
          city: "Burbank" ,
          username: "sample", 
          body: comment, 
          post_id: 2})
      }); 
    
      console.log("Comment sucessfully posted!")
      setComment("")
    } catch (e){
      console.log("Failed to post comment: ", e)
    }
  }

  
  return (
    <div className="w-full max-w-2xl bg-white shadow rounded-xl border border-gray-200 p-4 mb-4 mx-auto">
      {/* Top bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <div className="flex items-center gap-2">
          <Avatar size="sm" isBordered className="w-6 h-6" />
          <span className="font-semibold text-sm text-gray-700">
            {username}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            {formattedEditDate
              ? `Edited ${formattedEditDate}`
              : `Posted ${formattedDate}`}
          </span>
        </div>
      </div>

      {/* Post Content Section */}
      <div className="flex flex-col flex-grow text-xs relative">
        {/* Three Dots Menu */}
        {isOwner && isVerified && (
          <div className="absolute bottom-2 right-2">
            <EllipsisVerticalIcon
              className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border shadow-md rounded-md z-10 p-2">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post content */}
      <div className="text-sm text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
        {body}
      </div>

      {/* Interaction bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
        <div className="flex items-center space-x-2">
          <HandThumbUpIcon className="w-5 h-5 text-gray-500 hover:text-emerald-700 cursor-pointer" />
          <span className="text-sm font-medium text-gray-700">123</span>{" "}
          {/* Replace with real vote count */}
          <HandThumbDownIcon className="w-5 h-5 text-gray-500 hover:text-red-800 cursor-pointer" />
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-1 hover:text-black cursor-pointer">
            <Button
              className="bg-white"
              onPress={() => {
                showComments();
              }}>
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Comments
            </Button>
          </div>
          <div className="flex items-center gap-1 hover:text-black cursor-pointer">
            <ShareIcon className="w-4 h-4" />
            <span>Share</span>
          </div>
        </div>
      </div>

      {/*Leave a comment*/}
      <div className="mt-4">
        <form onSubmit={postComment}>
        <textarea
          name = "comment"
          className="w-full border rounded-md p-1 text-sm"
          placeholder="Leave a comment..."
          value = {comment}
          onChange = {(e) => setComment(e.target.value)}
        />
        <Button
          type ="submit">
          Submit
        </Button>
        </form>
        <div></div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Delete Post</ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to delete this post?</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onPress={() => {
                      handleDelete();
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
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Edit Post</ModalHeader>
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
                      handleEdit();
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
      )}
    </div>
  );
}
