import "@/app/globals.css";
import {
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
import React, { useEffect, useState } from "react";
import Comments from "./comments";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

interface PostProps {
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedBody, setEditedBody] = useState(body);

  const formattedDate = date.replace("T07:00:00.000Z", "");
  const formattedEditDate =
    editeddate === "null" ? "" : editeddate.replace("T07:00:00.000Z", "");

  const storage = getStorage();
  const [profileURL, setProfileURL] = useState("");

  // Get user profile pic url.
  useEffect(() => {
    const storageRef = ref(storage, 'profilePics/' + posterId);
      getDownloadURL(storageRef)
      .then((url) => {
        setProfileURL(url);
      }).catch((e) => {
        // Do Nothing
      })
  }, [])

  const handleDelete = () => {
    onDeletePost(contentId);
    setIsDeleteModalOpen(false);
  };

  const handleEdit = () => {
    onEditPost(contentId, editedBody);
    setIsEditModalOpen(false);
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
    <div className="w-full max-w-2xl bg-white shadow rounded-xl border border-gray-200 p-4 mb-4 mx-auto">
      {/* Top bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2 pt-2">
        <div className="flex items-center gap-2">
          <Avatar size="sm" isBordered className="w-6 h-6" src={profileURL}/>
          <span className="font-semibold text-sm text-gray-700">
          {highlightMatch(username, search)}
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
      <div className="text-large text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
        {highlightMatch(body, search)}
      </div>

      {/*Leave a comment*/}
      <Comments contentId={contentId} />



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
