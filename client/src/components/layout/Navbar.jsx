import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { useReputation } from "../../features/reputation/useReputation";
import ReputationBadge from "../reputation/ReputationBadge";

const Navbar = () => {
  const { user } = useAuth();
  const { score } = useReputation(user?._id);
  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        
        <Link 
          to="/" 
          className="text-xl font-semibold tracking-tight text-purple-400"
        >
          SIGNAL
        </Link>

        <div className="flex items-center gap-6">
          
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-sm text-slate-400 hover:text-purple-400 transition"
              >
                Profile
              </Link>

              {user && <ReputationBadge score={score} />}

              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-md text-sm font-medium transition">
                New Post
              </button>

              <button
                onClick={logout}
                className="text-sm text-slate-400 hover:text-red-400 ml-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-400 hover:text-purple-400 transition">
                Login
              </Link>
              <Link to="/register" className="text-sm text-slate-400 hover:text-purple-400 transition">
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