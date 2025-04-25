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
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/${contentID}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Fetched Post Data:", data); // <--- Add this
        setPost({
          userId: data.user_id,
          posterId: data.poster_id,
          username: data.username,
          date: data.post_date,
          editeddate: data.last_edit_date || "null",
          body: data.body,
          contentId: parseInt(data.id),
          isVerified: data.is_verified,
          isOwner: user?.displayName === data.username,
        });
      })
      .catch((err) => {
        console.error("❌ Failed to fetch post:", err);
      });
  }, [contentID, user]);

  if (!post) {
    return <p className="text-sm text-gray-500">Loading post...</p>;
  }

  return (
    <Post
      {...post}
      onDeletePost={() => {}}
      onEditPost={() => {}}
    />
  );
}
