import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import socket from "../services/socket";
import {
  getNotifications,
  markNotificationRead,
} from "../features/notifications/notificationAPI";
import { toggleFollowUser } from "../features/users/profileAPI";

const Notifications = () => {
  const { user } = useAuth();
  const myId = user?._id || user?.id;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!myId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    load();

    socket.connect();
    socket.emit("registerUser", String(myId));

    const onNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("newNotification", onNewNotification);
    return () => {
      socket.off("newNotification", onNewNotification);
      socket.disconnect();
    };
  }, [myId]);

  const handleFollowBack = async (notification) => {
    const actorId = notification?.actor?._id || notification?.actor;
    if (!actorId) return;

    await toggleFollowUser(actorId);
    await markNotificationRead(notification._id);
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notification._id ? { ...n, isRead: true, message: "You followed back." } : n
      )
    );
  };

  const handleMarkRead = async (notificationId) => {
    await markNotificationRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="w-full space-y-6 lg:max-w-4xl lg:mx-auto 2xl:max-w-5xl">
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Notifications</h1>
        {!user ? (
          <p className="text-slate-300 mt-2">Please log in to view notifications.</p>
        ) : loading ? (
          <p className="text-slate-300 mt-2">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-slate-300 mt-2">No new notifications right now.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {notifications.map((notification) => {
              const actorName = notification?.actor?.username || "Someone";
              const canFollowBack = notification.type === "follow" && !notification.isRead;

              return (
                <div
                  key={notification._id}
                  className={`rounded-lg border px-3 py-3 ${
                    notification.isRead
                      ? "border-slate-800 bg-slate-900/60"
                      : "border-purple-700/40 bg-slate-800/80"
                  }`}
                >
                  <p className="text-sm text-slate-200">{notification.message || `${actorName} followed you. Follow back?`}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {canFollowBack ? (
                      <button
                        type="button"
                        onClick={() => handleFollowBack(notification)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Follow back
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notification._id)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-700 text-slate-300 hover:border-slate-600"
                        disabled={notification.isRead}
                      >
                        {notification.isRead ? "Read" : "Mark as read"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Notifications;