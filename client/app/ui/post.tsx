import "@/app/globals.css"; // Import global styles
import { useAuthState } from "react-firebase-hooks/auth"; //import aut state
import { auth } from "@/app/firebase/config";

import {
  EllipsisVerticalIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline"; // Import icons from Heroicons
import {
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react"; // Import UI components from HeroUI
import React, { useEffect, useState } from "react"; // Import React and hooks
import Comments from "./comments"; // Import Comments component
import { getDownloadURL, getStorage, ref } from "firebase/storage"; // Import Firebase storage functions
import Vote from "./vote"; // Import Vote component

interface PostProps {
  // Define the props for the Post component
  userId: string;
  posterId: string;
  username: string;
  date: string;
  editeddate: string;
  body: string;
  contentId: number;
  isVerified: boolean;
  isOwner: boolean;
  onDeletePost: (contentId: number) => void;
  onEditPost: (contentId: number, newBody: string) => void;
  search?: string;
}

export default function Post({
  // define the Post component
  userId = "",
  posterId = "",
  username = "Default User",
  date = "",
  editeddate = "",
  body = "",
  contentId = 0,
  isVerified = false,
  isOwner = false,
  onDeletePost,
  onEditPost,
  search = "",
}: PostProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage the visibility of the menu
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to manage the visibility of the delete modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage the visibility of the edit modal
  const [editedBody, setEditedBody] = useState(body); // State to manage the edited body of the post

  const formattedDate = date.replace("T07:00:00.000Z", ""); // Format the date
  const formattedEditDate =
    editeddate === "null" ? "" : editeddate.replace("T07:00:00.000Z", ""); // Format the edited date

  const storage = getStorage(); // Initialize Firebase storage
  const [profileURL, setProfileURL] = useState(""); // State to manage the profile picture URL

  const [user] = useAuthState(auth);

  // Get user profile pic url.
  useEffect(() => {
    const storageRef = ref(storage, "profilePics/" + posterId); // Create a reference to the profile picture in Firebase storage
    getDownloadURL(storageRef) // Get the download URL for the profile picture
      .then((url) => {
        setProfileURL(url); // Set the profile picture URL in state
      })
      .catch((e) => {
        // Do Nothing
      });
  }, []);

  const handleDelete = () => {
    // Function to handle post deletion
    onDeletePost(contentId); // Call the onDeletePost function passed as a prop
    setIsDeleteModalOpen(false); // Close the delete modal
  };

  const handleEdit = () => {
    // Function to handle post editing
    onEditPost(contentId, editedBody); // Call the onEditPost function passed as a prop
    setIsEditModalOpen(false); // Close the edit modal
  };

  const highlightMatch = (text: string, keyword: string | undefined) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[--deep-moss] text-white px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    // Render the Post component
    <div className="w-full max-w-2xl bg-white shadow rounded-xl border border-gray-200 p-4 mb-4 mx-auto">
      {/* Top bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2 pt-2">
        <div className="flex items-center gap-2">
          <Avatar size="sm" isBordered className="w-6 h-6" src={profileURL} />
          <span className="font-semibold text-sm text-gray-700">
          {highlightMatch(username, search)}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            {formattedEditDate
              ? `Edited ${formattedEditDate}` // Display the edited date if available
              : `Posted ${formattedDate}`}{" "}
            {/* Display the formatted date */}
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
                    setIsMenuOpen(false); // Close the menu
                    setIsEditModalOpen(true); // Open the edit modal
                  }}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  onClick={() => {
                    setIsMenuOpen(false); // Close the menu
                    setIsDeleteModalOpen(true); // Open the delete modal
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
      <div className="text-large text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
        {highlightMatch(body, search)}
      </div>
      {/* Post Interaction Bar - This clearly belongs to the post */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-4 pt-2">
        <Vote
          contentId={contentId} // Pass the contentId to the Vote component
          userId={userId || ""} // Pass the userId to the Vote component
          username={username || ""} // Pass the username to the Vote component
        />
        <div className="flex items-center space-x-6">
        {user && (
        <div className="flex items-center gap-1 hover:text-black cursor-pointer">
          <ChatBubbleLeftIcon className="w-4 h-4" />
          <span>Comments</span>
        </div>
        )}

          <div
            className="flex items-center gap-1 hover:text-black cursor-pointer"
            onClick={() => {
              setCopied(false);
              setIsShareModalOpen(true);
            }}
            >
            <ShareIcon className="w-4 h-4" />
            <span>Share</span>
          </div>
        </div>
      </div>
      {/*Leave a comment*/}
      <Comments contentId={contentId} subforumId={"General"}/> {/* Render the Comments component */}
      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <ModalContent>
          {(onClose: () => void) => (
              <>
                <ModalHeader>Delete Post</ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to delete this post?</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onPress={() => {
                      handleDelete(); // Call the handleDelete function
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
          {(onClose: () => void) => (

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
                      handleEdit(); // Call the handleEdit function
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

      {isShareModalOpen && (
        <Modal isOpen={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Share Post</ModalHeader>
                <ModalBody>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Copy and share the link below:</p>
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/dashboard/post/${contentId}`}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <Button
                      className="w-full bg-[--olive-stone] text-white hover:bg-[--deep-moss]"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/dashboard/post/${contentId}`
                        );
                        setCopied(true);
                      }}
                    >
                      Copy Link
                    </Button>
                    {copied && (
                      <p className="text-sm text-[--muted-terracotta]">
                        Link copied to clipboard!
                      </p>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" onPress={onClose}>
                    Close
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
