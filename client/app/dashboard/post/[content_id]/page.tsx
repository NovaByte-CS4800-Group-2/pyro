"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import PostWrapper from "./postWrapper";

interface Props {
  params: Promise<{ content_id: string }>;
}

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

export default function SharedPostPage({ params }: Props) {
  const [contentID, setContentID] = useState<string | null>(null);
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    params.then(({ content_id }) => {
      if (content_id) {
        setContentID(content_id);
      } else {
        console.error("❌ No content_id found in resolved params!");
      }
    });
  }, [params]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!contentID) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get/post/${contentID}`);
        const body = await res.json();
        const data = body.post;

        if (!data) {
          console.error("❌ Post not found!");
          return;
        }

        setPost({
          userId: data.user_id,
          posterId: data.user_id,
          username: data.username,
          date: data.post_date,
          editeddate: data.last_edit_date || "null",
          body: data.body,
          contentId: parseInt(data.id),
          isVerified: data.is_verified,
          isOwner: false, // <- always false for shared post
        });
      } catch (error) {
        console.error("❌ Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [contentID]);

  if (!contentID || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full border border-gray-200 overflow-y-auto max-h-[90vh] text-center">
          <p className="text-gray-500">Loading shared post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full border border-gray-200 overflow-y-auto max-h-[90vh] text-center">
          <p className="text-gray-500">Post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full border border-gray-200 overflow-y-auto max-h-[90vh]">
        <PostWrapper post={{ ...post, isOwner: false }} />
      </div>
    </div>
  );
}
