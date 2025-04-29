import "@/app/globals.css"; // Import global styles

import { ShareIcon } from "@heroicons/react/24/outline"; // Import icons from Heroicons
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Link,
} from "@heroui/react"; // Import UI components from HeroUI
import React, { useState } from "react"; // Import React and hooks
import Comments from "./comments"; // Import Comments component
import Content, { ContentProps } from "./content";

const isSharedPost = typeof window !== "undefined" && window.location.pathname.includes("/shared/");

type PostComponentProps = ContentProps & {
  onRefresh: () => void; // Function to refresh the post
};

export default function Post(props: PostComponentProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isSharedPost = props.isSharedPost ?? false;

  const { contentId, onRefresh, subforumId } = props;
  console.log("Subforum ID passed to comments:", subforumId); // Debug log

  return (
    <div className="w-full max-w-2xl bg-white shadow rounded-xl border border-gray-200 p-4 mb-4 mx-auto">
      <Content
        {...props}
        isSharedPost={isSharedPost} 
        contentType="post"
        onUpdateContent={() => onRefresh()}
        onDeleteContent={() => onRefresh()}
      >
        <div className="flex items-center space-x-6">
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

      </Content>
      {/*Leave a comment*/}
      <Comments contentId={contentId} subforumId={subforumId} />
    

      {/* Share Modal */}
      {isShareModalOpen && (
        <Modal isOpen={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Share Post</ModalHeader>
                <ModalBody>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Copy and share the link below:
                    </p>
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
                        )
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
  )
}
