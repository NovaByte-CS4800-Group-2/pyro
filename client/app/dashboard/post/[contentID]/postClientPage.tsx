"use client";

import { useEffect, useState } from "react";
import Post from "@/app/ui/post";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

interface PostData {
  userId: string;
  posterId: string;
  username: string;
  date: string;
  editeddate: string;
  body: string;
  contentId: number;
  isVerified: boolean;
  isOwner: boolean;
}

export default function PostClientPage({ contentID }: { contentID: string }) {
  const [post, setPost] = useState<PostData | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get/post/${contentID}`)
        const data = await res.json();
        setPost({
          userId: data.user_id,
          posterId: data.user_id,
          username: data.username,
          date: data.post_date,
          editeddate: data.last_edit_date || "null",
          body: data.body,
          contentId: parseInt(data.id),
          isVerified: data.is_verified,
          isOwner: user ? user.displayName === data.username : false,
        });
      } catch (err) {
        console.error("❌ Failed to fetch post:", err);
      }
    };

    fetchPost();
  }, [contentID, user?.displayName]); // notice: only depend on user.displayName instead of whole user

  if (!post) {
    return <p className="text-sm text-gray-500">Loading post...</p>;
  }

  return (
    <Post
      contentType="post"
      postDate={post.date}
      lastEditDate={post.editeddate}
      {...post}
      onDeleteContent={() => {}}
      onUpdateContent={() => {}}
      onRefresh={() => {}}
    />
  );
}
