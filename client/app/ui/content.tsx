'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './button';

interface ContentProps {
  content: string;
  contentType: 'post' | 'comment';
  contentId: number;
  postId?: number;
  isAuthor: boolean;
}

export default function Content({
  content: initialContent,
  contentType,
  contentId,
  postId,
  isAuthor,
}: ContentProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);

  const endpoint = contentType === 'post' ? 'http://localhost:8080/post' : 'http://localhost:8080/comment';

  const handleUpdate = async () => {
    if (!editedContent.trim()) return;

    try {
      const res = await fetch(`${endpoint}/edit`, {
        method: 'POST',
        body: JSON.stringify({
          id: contentId,
          content: editedContent,
          ...(contentType === 'comment' && { postId }),
        }),
      });

      if (res.ok) {
        setContent(editedContent);
        setIsEditing(false);
        router.refresh();
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${endpoint}/delete/${contentId}`, {
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // return (

  // );
}
