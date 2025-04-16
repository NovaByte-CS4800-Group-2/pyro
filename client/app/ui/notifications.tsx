'use client';

import { useEffect, useState } from 'react';

interface Notification {
  content_id: number;
  date: string;
  type: string;
  read: boolean;
	username: string;
}

interface NotificationsProps {
  userId: string;
}

export default function Notifications({ userId }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications and mark unread ones as read
  useEffect(() => {
    const fetchAndMarkNotifications = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get/notifications/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);

        // Immediately mark all as read
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mark/notifcations/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });
      }
      setLoading(false);
    };

    fetchAndMarkNotifications();
  }, [userId]);

  // Delete notification from backend and local state
  const deleteNotif = async (content_id: number, type: string) => {
    // Optimistically remove from state
    setNotifications((prev) =>
      prev.filter((notif) => !(notif.content_id === content_id && notif.type === type))
    );

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/remove/notification/${content_id}/${type}`, {
      method: 'DELETE',
    });
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notif, index) => (
          <div
            key={`${notif.content_id}-${notif.type}-${index}`} // fallback key since notification_id is gone
            className={`relative border p-4 rounded shadow-sm ${notif.read ? 'bg-gray-100' : 'bg-white'}`}
          >
            {/* Small "x" button to delete */}
            <button
              onClick={() => deleteNotif(notif.content_id, notif.type)}
              className="absolute top-2 right-2 text-sm text-gray-400 hover:text-red-500"
              aria-label="Delete notification"
            >
              ×
            </button>

            <p className="text-sm">
              {notif.username} sent you a new <span className="font-medium">{notif.type}</span> (ID: {notif.content_id})
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Received on {new Date(notif.date).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
