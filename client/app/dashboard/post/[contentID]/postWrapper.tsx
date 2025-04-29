"use client";

import Post from "@/app/ui/post";
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

  // disable all interactivity if not logged in
  const canInteract = !!user;

  return (
    <Post
      userId={post.userId}
      posterId={post.posterId}
      username={post.username}
      //date={post.date}
      //editeddate={post.editeddate}
      body={post.body}
      contentId={post.contentId}
      isVerified={post.isVerified}
      isOwner={post.isOwner && canInteract}
      onDeleteContent={canInteract ? () => { } : () => { } }
      onUpdateContent={canInteract ? () => { } : () => { } }
      search={""} contentType={"post"} postDate={""} lastEditDate={""} onRefresh={function (): void {
        throw new Error("Function not implemented.");
      } }    />
  );
}
