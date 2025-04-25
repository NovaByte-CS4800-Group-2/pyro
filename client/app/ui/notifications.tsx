'use client';

import { useEffect, useState } from 'react';
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbDownIcon as DownFilled,
  HandThumbUpIcon as UpFilled,
} from "@heroicons/react/24/solid";

interface Notification {
  content_id: number;
  date: string;
  type: string;
  read: boolean;
  username: string;
}

interface Content {
  content_id: number;
  subforum_id: number;
  user_id: string;
  body: string;
  vote?: number;
  post?: string;
}

interface FullNotification extends Notification {
  content: Content | null;
}

interface NotificationsProps {
  userId: string;
  username: string;
}

export default function Notifications({ userId, username }: NotificationsProps) {
  const [notifications, setNotifications] = useState<FullNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMarkNotifications = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get/notifications/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();

        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mark/notifcations/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });

        const res1 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get/notification/content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notifications: data.notifications }),
        });

        if (!res1.ok) throw new Error('Failed to fetch content for notifications');
        const contentData = await res1.json();

        const merged = data.notifications.map((notif: Notification) => ({
          ...notif,
          content: contentData.notifications.find((c: Content) => c.content_id === notif.content_id) || null,
        }));

        setNotifications(merged);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMarkNotifications();
  }, [userId]);

  const deleteNotif = async (content_id: number, type: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => !(notif.content_id === content_id && notif.type === type))
    );
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/remove/notification/${content_id}/${type}`, {
      method: 'DELETE',
    });
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="space-y-2 max-w-sm max-h-[60vh] overflow-y-auto p-2 bg-white rounded shadow border border-gray-200">
      <h3 className="text-base font-bold">Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notif, index) => (
          <div
            key={`${notif.content_id}-${notif.type}-${index}`}
            className={`relative border p-4 rounded shadow-sm ${notif.read ? 'bg-stone-100' : 'bg-white'}`}
          >
            <button
              onClick={() => deleteNotif(notif.content_id, notif.type)}
              className="absolute top-2 right-2 text-sm text-gray-400 hover:text-red-500"
              aria-label="Delete notification"
            >
              ×
            </button>

            <p className="text-xs text-gray-500">
              {new Date(notif.date).toLocaleDateString()}
            </p>

            {notif.type === 'matching' ? (
              <p className="mt-2 font-semibold text-gray-800">
                You’ve got a match!
              </p>
            ) : notif.type === 'callout' ? (
              <p className="mt-2 font-semibold text-gray-800">
                {notif.username} mentioned you
              </p>
            ) : (
              <p className="mt-2 font-semibold">
                {notif.username} sent you a new {notif.type}
              </p>
            )}

            <div className="mt-2 text-sm whitespace-pre-wrap">
              {notif.type === 'vote' && notif.content ? (
                <>
                  <div className="p-2 rounded border text-gray-800 mb-1">
                    {notif.content.body}
                  </div>
                  {notif.content.vote === 1 ? (
                    <div className="flex items-center gap-2">
                      <UpFilled className="w-5 h-5 text-emerald-700" />
                      <HandThumbDownIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <HandThumbUpIcon className="w-5 h-5 text-gray-500" />
                      <DownFilled className="w-5 h-5 text-red-800" />
                    </div>
                  )}
                </>
              ) : notif.type === 'comment' && notif.content ? (
                <>
                  <div className="rounded border text-gray-800 mb-1 p-3">
                    {notif.content.post}
                    <hr className="my-2 border-gray-300" />
                    <p className="ml-4 italic text-gray-700">
                      “
                      {notif.content.body.split(/(@[\w.-]+)/g).map((part, i) =>
                        part === `@${username}` ? (
                          <span key={i} className="text-blue-600 font-semibold">{part}</span>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                      ”
                    </p>
                  </div>


                  {/* <div className="rounded border text-gray-800 mb-1 p-3">
                    {notif.content.post}
                    <hr className="my-2 border-gray-300" />
                    <p className="ml-4 italic text-gray-700">“{notif.content.body}”</p>
                  </div> */}
                </>
              ) : notif.type === 'matching' ? (
                <div className="p-3 rounded border text-gray-800 space-y-2">
                  <p>
                    You’ve been paired with <strong>{notif.username}</strong>!
                  </p>
                  <p>
                    Reach out to them via email to coordinate details and finalize plans.
                  </p>
                  <p>
                    Let us know if you need any help along the way — happy connecting!
                  </p>
                </div>
              ) : notif.type === 'callout' && notif.content ? (
                <div className="p-2 rounded border text-gray-800">
                  {notif.content.body.split(/(@[\w.-]+)/g).map((part, i) =>
                    part === `@${username}` ? (
                      <span key={i} className="text-blue-600 font-semibold">{part}</span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              ) : (
                <div className="p-2 rounded border text-gray-800">
                  {notif.content?.body}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
