import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const { user, logout } = useAuth();
  const { score } = useReputation(user?._id);
  const initials = getUserInitials(user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const linkClass =
    "text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("q") || "");
  }, [location.search]);

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between gap-3 px-3 sm:px-4 lg:px-8">
        <Link 
          to="/" 
          className="text-base sm:text-lg font-semibold tracking-tight text-slate-100"
        >
          SIGNAL
        </Link>

        <form onSubmit={handleSubmitSearch} className="flex flex-1 max-w-md items-center">
          <label htmlFor="nav-search" className="sr-only">
            Search posts
          </label>
          <div className="relative w-full">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              Search
            </span>
            <input
              id="nav-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder=""
              className="w-full rounded-md border border-slate-700 pl-20 pr-3 py-1.5 text-sm text-slate-100 outline-none focus:border-purple-500"
            />
          </div>
        </form>

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          {user ? (
            <>
              <Link
                to="/"
                onClick={handleGoHome}
                className={linkClass}
                aria-label="Home"
                title="Home"
              >
                Home
              </Link>

              <Link
                to="/messages"
                className={linkClass}
                aria-label="Messages"
                title="Messages"
              >
                Messages
              </Link>

              <Link
                to="/profile"
                className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-900 text-[11px] font-semibold text-slate-200 hover:border-purple-500 transition-colors"
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

              <button
                onClick={logout}
                className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={handleGoHome} className={linkClass}>
                Home
              </Link>
              <Link to="/login" className={linkClass}>
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-md border border-purple-600 bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
              >
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