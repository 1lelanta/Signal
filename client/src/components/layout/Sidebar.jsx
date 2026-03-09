import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../features/auth/useAuth";
import { useReputation } from "../../features/reputation/useReputation";
import { getUnreadMessagesCount } from "../../features/messages/messagesAPI";
import socket from "../../services/socket";
import { useTheme } from "../../app/themeContext";
import ReputationBadge from "../reputation/ReputationBadge";

const linkBase = "block px-4 py-2 rounded-md text-sm transition";

const Sidebar = () => {
  const { user } = useAuth();
  const { score } = useReputation(user?._id);
  const { isWarm } = useTheme();
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
    <aside
      className={`w-64 h-[calc(100vh-64px)] border-r p-4 ${
        isWarm ? "border-stone-300 bg-stone-100" : "border-slate-800 bg-slate-900"
      }`}
    >
      {user && (
        <Link
          to="/profile"
          className={`mb-4 block rounded-lg border p-3 transition-colors ${
            isWarm
              ? "border-stone-300 bg-stone-50 hover:bg-stone-200"
              : "border-slate-800 bg-slate-950 hover:bg-slate-800"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-700 bg-slate-800 shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.username || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-300">
                  {String(user?.username || "U").slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p
                className={`truncate text-sm font-semibold ${
                  isWarm ? "text-slate-900" : "text-slate-100"
                }`}
              >
                {user?.username || "User"}
              </p>
              <p
                className={`truncate text-xs ${
                  isWarm ? "text-stone-600" : "text-slate-500"
                }`}
              >
                @{user?.username || "user"}
              </p>
              <div className="mt-1">
                <ReputationBadge score={score} />
              </div>
              <p
                className={`mt-1 line-clamp-2 text-xs ${
                  isWarm ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {user?.bio?.trim() || "No bio added yet."}
              </p>
            </div>
          </div>
        </Link>
      )}

      <nav className="space-y-2">
        
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : isWarm
                ? "text-slate-600 hover:bg-stone-200"
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
                : isWarm
                ? "text-slate-600 hover:bg-stone-200"
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
                : isWarm
                ? "text-slate-600 hover:bg-stone-200"
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
                : isWarm
                ? "text-slate-600 hover:bg-stone-200"
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
                : isWarm
                ? "text-slate-600 hover:bg-stone-200"
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

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-purple-600 text-white"
                : isWarm
                ? "text-slate-600 hover:bg-stone-200"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        {user?.trustLevel === "moderator" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-red-600 text-white"
                  : isWarm
                  ? "text-slate-600 hover:bg-stone-200"
                  : "text-slate-400 hover:bg-slate-800"
              }`
            }
          >
            Admin
          </NavLink>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;