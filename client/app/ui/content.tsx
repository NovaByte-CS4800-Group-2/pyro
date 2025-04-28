"use client";

import { useState, useEffect, use } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {
  Button,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import Vote from "./vote";

export interface ContentProps {
  userId: string;
  posterId: string;
  username: string;
  contentType: "post" | "comment";
  contentId: number;
  body: string;
  postDate: string;
  lastEditDate: string;
  isOwner: boolean;
  isVerified: boolean;
  parentId?: number;
  subforumId?: string;
  onUpdateContent: (contentId: number, newBody: string) => void;
  onDeleteContent: (contentId: number) => void;
  search?: string;
  children?: React.ReactNode;
  className?: string; // Added className prop
}

export default function Content({
  userId = "",
  posterId = "",
  username = "",
  contentType = "post",
  contentId = 0,
  body = "",
  postDate = "",
  lastEditDate = "",
  isVerified = false,
  isOwner = false,
  onUpdateContent,
  onDeleteContent,
  search = "",
  className = "", // Destructure className
  children,
}: ContentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedBody, setEditedBody] = useState(body);
  const [profileURL, setProfileURL] = useState("");
  const [mediaURLs, setMediaURL] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "null") return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Invalid dat
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "";
    }
  };
  

  const formattedPostDate = formatDate(postDate);
  const formattedLastEditDate = formatDate(lastEditDate);

  useEffect(() => {
    console.log("Effect triggered:", { contentType, posterId });
    if (contentType === "post" && posterId) {
      const storage = getStorage();
      const storageRef1 = ref(storage, "profilePics/" + posterId);
      getDownloadURL(storageRef1)
        .then((url) => {
          setProfileURL(url);
        })
        .catch((e) => {
          // Silent fail - no profile pic available
        });
    }
  }, [contentType, posterId]);

  

  const deleteContent = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/delete/${contentType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            contentType === "comment"
              ? { comment_id: contentId }
              : { content_id: contentId }
          ),
        }
      );
      await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/remove/notification/${contentId}/${
          contentType === "post" ? "callout" : "comment"
        }`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete content.");
      }

      console.log(`${contentType} deleted successfully!`);

      onDeleteContent(contentId); // Call the parent function to update state
      setIsDeleteModalOpen(false); // Close the modal
    } catch (error) {
      setErrorMessage(`Failed to delete ${contentType}.`);
      console.error(`Error deleting ${contentType}:`, error);
    }
  };

  const editContent = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/edit/${contentType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_id: contentId,
            newBody: editedBody,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to edit ${contentType}.`);
      }

      // Call the callback to update the UI
      onUpdateContent(contentId, editedBody);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(`Error editing ${contentType}:`, error);
      setErrorMessage(`Failed to edit ${contentType}.`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContent();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(`Error deleting ${contentType}:`, error);
    }
  };

  const handleEdit = async () => {
    try {
      await editContent();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(`Error editing ${contentType}:`, error);
    }
  };

  const highlightMatch = (text: string, keyword: string | undefined) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[--deep-moss] text-white px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };



  const defaultContainerClasses =
    contentType === "post"
      ? "w-full max-w-2xl bg-white rounded-xl p-2 mb-2 mx-auto"
      : "border-t border-gray-200 pt-2 mt-2 text-sm text-gray-700 relative";

  const containerClasses = className || defaultContainerClasses;

  const bodyClasses =
    contentType === "post"
      ? "text-large text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap"
      : "mt-1 mb-2 text-base";


  useEffect(() => {
    const fetchImageURLs = async () => {
      const storage = getStorage();

      const imageNames1 = ['comic.png']; 

      const imageNames = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/get/media/${contentId}` 
          );
        } catch (error) { // Handle errors
          console.error("Error fetching media:", error);
          setErrorMessage("Failed to fetch media.");
        }
      }

      // get the image names from db
      try {
        // Fetch all image URLs from Firebase Storage
        const urls = await Promise.all(
          imageNames.map(async (imageName) => {
            console.log("THIS IS CONTENT ID", contentId)
            const imageRef = ref(storage, `media/${imageName}`);
            const url = await getDownloadURL(imageRef);
            return url;
          })
        );
        
        setMediaURL(urls); // Set the URLs in state
      } catch (error) {
        console.error('Error fetching images:', error);
        setErrorMessage('Failed to load images.');
      }
    };

    fetchImageURLs();
  }, []);

  const showImages = mediaURLs.map((url, index) => (
    <img key={index} src={url} alt={`Image ${index}`} width={150} />
  ));
      

  return (
    <div className={containerClasses}>
      {/* Header - Username and Date */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2 pt-2">
        <div className="flex items-center gap-2">
          {contentType === "post" && (
            <Avatar size="sm" isBordered className="w-6 h-6" src={profileURL} />
          )}
          <span className="font-semibold text-sm text-gray-700">
            {highlightMatch(username, search)}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            {formattedLastEditDate
              ? `Edited ${formattedLastEditDate}`
              : `Posted ${formattedPostDate}`}
          </span>
        </div>

        {/* Menu Button (only for content owner) */}
        {isOwner && (contentType === "comment" || isVerified) && (
          <div className="relative">
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
      
      {/* Content Body */}
      <div className={bodyClasses}>{highlightMatch(body, search)}</div>
      <div > Here are my images: {showImages} </div>

      {/* Content Interaction Bar */}
      <div
        className={`flex ${
          contentType === "post" ? "justify-between" : "justify-start"
        } items-center text-xs text-gray-500 mt-1 ${
          contentType === "comment" ? "small-thumbs-vote" : ""
        }`}
      >
        <Vote
          contentId={contentId}
          userId={userId || ""}
          username={username || ""}
        />

        {/* Custom content passed as children */}
        {children}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-sm text-red-500 mt-2">{errorMessage}</div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          {(onClose: () => void) => (
            <>
              <ModalHeader>
                Edit {contentType === "post" ? "Post" : "Comment"}
              </ModalHeader>
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

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent>
          {(onClose: () => void) => (
            <>
              <ModalHeader>
                Delete {contentType === "post" ? "Post" : "Comment"}
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this {contentType}?</p>
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
    </div>
  );
}
