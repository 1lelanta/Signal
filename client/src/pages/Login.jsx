import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { loginUser, getCurrentUser } from "../features/auth/authAPI";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../app/themeContext";

const Login = () => {
  const { login } = useAuth();
  const { isWarm } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(form);
      // API returns { success, token, user }
      // persist token and set immediate user placeholder
      login(data.user, data.token);

      // fetch authoritative current user after token stored (handles partial login responses)
      try {
        const me = await getCurrentUser();
        if (me?.user) {
          // update context with authoritative user
          // use the same login function to ensure axios headers are set
          login(me.user, data.token);
        }
      } catch (e) {
        // continue with the original response if /auth/me fails
        console.warn("Could not fetch /auth/me after login", e?.message || e);
      }
      // If the user is a moderator, always send them to the admin dashboard
      if (String(data.user?.trustLevel || "").toLowerCase() === "moderator") {
        navigate("/admin", { replace: true });
        return;
      }

      // If redirected from a protected route, go back there. Otherwise go to home
      const isGenericFrom = ["/", "/login", "/register"].includes(from);
      if (isGenericFrom) {
        // regular users (including demo user) go to the normal home feed
        navigate("/", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials to help guests
  const DEMO_ADMIN = { email: "admin2-demo@example.com", password: "Password123!" };
  const DEMO_USER = { email: "demo-user@example.com", password: "Password123!" };

  const useDemo = (creds) => {
    setForm({ email: creds.email, password: creds.password });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        isWarm ? "bg-gradient-to-br from-stone-50 to-stone-100 text-slate-900" : "bg-gradient-to-br from-slate-950 to-slate-900 text-white"
      }`}
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className={`rounded-xl shadow-xl p-8 ${isWarm ? 'bg-white' : 'bg-slate-900'}`}>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-indigo-500">Signal</h1>
            <p className="text-sm mt-2 text-slate-400">A demo workspace — sign in to continue</p>
          </div>

        {error && (
          <p className="text-red-400 text-center mb-4 bg-red-900/20 p-3 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white shadow-sm"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
        </div>

        <aside className={`rounded-xl shadow-lg p-6 ${isWarm ? 'bg-slate-50' : 'bg-slate-800'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Demo accounts</h3>
              <p className="mt-1 text-sm text-slate-400">Quick sign-in for exploration</p>
            </div>
            <div className="text-3xl">✨</div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between rounded-md p-3 bg-gradient-to-r from-slate-700/30 to-transparent">
              <div>
                <div className="text-xs text-slate-300">User</div>
                <div className="font-medium">{DEMO_USER.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => useDemo(DEMO_USER)} className="px-3 py-1 bg-slate-700 text-white rounded-md text-sm">Autofill</button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md p-3 bg-gradient-to-r from-amber-600/10 to-transparent">
              <div>
                <div className="text-xs text-slate-400">Admin</div>
                <div className="font-medium">{DEMO_ADMIN.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => useDemo(DEMO_ADMIN)} className="px-3 py-1 bg-amber-600 text-white rounded-md text-sm">Autofill</button>
              </div>
            </div>

            <div className="text-xs text-slate-400 mt-2">Use these demo accounts to explore the app. Password for both is <span className="font-mono">Password123!</span></div>
          </div>
        </aside>

        <p className="text-center text-sm text-slate-300 mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-purple-400 hover:text-purple-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;