import "@/app/globals.css";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
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
import { useState } from "react";

interface PostProps {
  username: string;
  date: string;
  editeddate: string;
  body: string;
  contentId: number;
  onDeletePost: (contentId: number) => void; 
  onEditPost: (contentId: number, newBody: string) => void; 
}

export default function Post({
  username = "Default User",
  date = "",
  editeddate = "",
  body = "",
  contentId = 0,
  onDeletePost,
  onEditPost,
}: PostProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For the three dots menu
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For delete confirmation
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For edit modal
  const [editedBody, setEditedBody] = useState(body); // State for edited post content

  // Format the date strings
  const formattedDate = date.replace("T07:00:00.000Z", "");
  const formattedEditDate =
    editeddate === "null" ? "" : editeddate.replace("T07:00:00.000Z", "");

  // Handle the delete action
  const handleDelete = () => {
    if (onDeletePost && contentId) {
      onDeletePost(contentId); // Call the deletePost function with the contentId
      setIsDeleteModalOpen(false); // Close the modal after deletion
    }
  };

  // Handle the edit action
  const handleEdit = () => {
    if (onEditPost && contentId) {
      onEditPost(contentId, editedBody); // Call the editPost function with the contentId and new body
      setIsEditModalOpen(false); // Close the modal after editing
    }
  };

  return (
    <div className="bg-neutral-50 flex text-center ml-2 mr-2 rounded-md overflow-visible shadow-md max-w-[700px] p-4">
      {/* User Info Section */}
      <div className="flex items-center gap-1 flex-col bg-neutral-300 p-2 font-bold text-sm max-w-20">
        <p className="line-clamp-1 hover:line-clamp-none">{username}</p>
        <Avatar
          className="min-w-[45px] min-h-[45px]"
          size="md"
          src={undefined}
          isBordered
        />
        <div className="flex justify-center">
          <HandThumbUpIcon className="w-1/3 hover:text-green-800" />
          <HandThumbDownIcon className="w-1/3 hover:text-red-900" />
        </div>
      </div>

      {/* Post Content Section */}
      <div className="flex flex-col flex-grow text-xs relative">
        <div className="bg-neutral-300 flex justify-between pl-1 pr-1">
          <p>Posted: {formattedDate}</p>
          <p>
            {formattedEditDate !== "" ? "Last Edited: " : ""}
            {formattedEditDate}
          </p>
        </div>
        <div className="overflow-auto p-1 pt-0.5 pb-0.5 text-start md:text-lg sm:text-sm">
          {body}
        </div>

        {/* Three Dots Menu */}
        <div className="absolute bottom-2 right-2">
          <EllipsisVerticalIcon
            className="w-6 h-6 cursor-pointer hover:text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle the menu
          />
          {isMenuOpen && (
            <div className="absolute right-0 bottom-8 bg-white shadow-lg rounded-md p-2">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsEditModalOpen(true); // Open the edit modal
                }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsDeleteModalOpen(true); // Open the delete confirmation modal
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
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
