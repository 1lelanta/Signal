import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { useReputation } from "../../features/reputation/useReputation";
import ReputationBadge from "../reputation/ReputationBadge";
import { useTheme } from "../../app/themeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { score } = useReputation(user?._id);
  const { isWarm, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const linkClass = `text-sm font-medium transition-colors ${
    isWarm ? "text-slate-700 hover:text-slate-900" : "text-slate-300 hover:text-slate-100"
  }`;

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
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur ${
        isWarm ? "border-stone-300 bg-stone-100/95" : "border-slate-800 bg-slate-950/95"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between gap-3 px-3 sm:px-4 lg:px-8">
        <Link 
          to="/" 
          className={`text-base sm:text-lg font-semibold tracking-tight ${
            isWarm ? "text-slate-900" : "text-slate-100"
          }`}
        >
          SIGNAL
        </Link>

        <form onSubmit={handleSubmitSearch} className="flex flex-1 max-w-md items-center">
          <label htmlFor="nav-search" className="sr-only">
            Search posts
          </label>
          <div className="relative w-full">
            <span
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                isWarm ? "text-stone-500" : "text-slate-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
            </span>
            <input
              id="nav-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className={`w-full rounded-md border pl-10 pr-3 py-1.5 text-sm outline-none focus:border-purple-500 ${
                isWarm
                  ? "border-stone-300 text-slate-900 placeholder:text-stone-500"
                  : "border-slate-700 text-slate-100 placeholder:text-slate-500"
              }`}
            />
          </div>
        </form>

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <button
            onClick={toggleTheme}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
              isWarm
                ? "border-stone-300 text-amber-500 hover:text-amber-600"
                : "border-slate-700 text-slate-300 hover:text-slate-100"
            }`}
            title={isWarm ? "Switch to dark mode" : "Switch to warm mode"}
            aria-label={isWarm ? "Switch to dark mode" : "Switch to warm mode"}
          >
            {isWarm ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>

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

              <div className="hidden md:block">
                {user && <ReputationBadge score={score} />}
              </div>

              <button
                onClick={logout}
                className={`text-sm font-medium transition-colors ${
                  isWarm ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-slate-200"
                }`}
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