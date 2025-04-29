"use client";

import Post from "@/app/ui/post";
import Comments from "@/app/ui/comments"; // Keep the same import
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

interface WrapperProps {
  post: {
    userId: string;
    posterId: string;
    username: string;
    date: string;
    editeddate: string;
    body: string;
    contentId: number;
    isVerified: boolean;
    isOwner: boolean;
  };
}

export default function PostWrapper({ post }: WrapperProps) {
  const [user] = useAuthState(auth);

  const canInteract = false; // <-- force no interaction on shared posts

  return (
    <Post
      userId={post.userId}
      posterId={post.posterId}
      username={post.username}
      body={post.body}
      contentId={post.contentId}
      isVerified={post.isVerified}
      isOwner={false} // <- always false here too
      search=""
      contentType="post"
      postDate={post.date}
      lastEditDate={post.editeddate}
      onDeleteContent={() => {}}
      onUpdateContent={() => {}}
      onRefresh={() => {}}
    >
      {/* Comments normally rendered */}
      <Comments contentId={post.contentId} />
    </Post>
  );
}
