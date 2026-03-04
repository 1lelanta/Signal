import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { useReputation } from "../../features/reputation/useReputation";
import ReputationBadge from "../reputation/ReputationBadge";

const getUserInitials = (user) => {
  const fullName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "U";

  const parts = String(fullName)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return parts[0]?.slice(0, 2).toUpperCase() || "U";
};

const Navbar = () => {
  const { user } = useAuth();
  const { score } = useReputation(user?._id);
  const { logout } = useAuth();
  const initials = getUserInitials(user);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="w-full px-3 sm:px-4 flex items-center justify-between h-16 gap-3">
        
        <Link 
          to="/" 
          className="text-lg sm:text-xl font-semibold tracking-tight text-purple-400"
        >
          SIGNAL
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          
          {user ? (
            <>
              <Link
                to="/profile"
                className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 overflow-hidden bg-slate-800 text-xs font-semibold text-slate-200 hover:border-purple-500 transition"
                aria-label="Profile"
                title="Profile"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.username || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </Link>

              <div className="hidden md:block">
                {user && <ReputationBadge score={score} />}
              </div>

              <Link
                to="/messages"
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-purple-400 transition"
                aria-label="Messages"
                title="Messages"
              >
                💬 Messages
              </Link>

              <Link
                to="/"
                className="hidden md:inline-flex bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-md text-sm font-medium transition"
              >
                New Post
              </Link>

              <button
                onClick={logout}
                className="text-xs sm:text-sm text-slate-400 hover:text-red-400 sm:ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-xs sm:text-sm font-medium text-slate-300 hover:text-purple-400 transition">
                Login
              </Link>
              <Link to="/register" className="text-xs sm:text-sm font-medium text-slate-300 hover:text-purple-400 transition">
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;