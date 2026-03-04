import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../features/auth/useAuth";
import { getUnreadMessagesCount } from "../../features/messages/messagesAPI";
import socket from "../../services/socket";

const linkBase = "block px-4 py-2 rounded-md text-sm transition";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userId = user?._id || user?.id;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (location.pathname.startsWith("/messages")) {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    const loadUnreadCount = async () => {
      try {
        const data = await getUnreadMessagesCount();
        setUnreadCount(Number(data?.count || 0));
      } catch {
        setUnreadCount(0);
      }
    };

    loadUnreadCount();

    socket.connect();
    socket.emit("registerUser", String(userId));

    const onIncomingMessage = (message) => {
      if (String(message?.receiver) === String(userId)) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("message:new", onIncomingMessage);
    return () => {
      socket.off("message:new", onIncomingMessage);
      socket.disconnect();
    };
  }, [userId]);

  return (
    <aside className="w-64 h-[calc(100vh-64px)] border-r border-slate-800 bg-slate-900 p-4">
      <nav className="space-y-2">
        
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Deep Feed
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Explore
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Notifications
        </NavLink>

        <NavLink
          to="/reputation"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Reputation
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          <span className="inline-flex items-center gap-2">
            Messages
            {unreadCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-blue-600 text-white text-[11px] leading-5 text-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </span>
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;