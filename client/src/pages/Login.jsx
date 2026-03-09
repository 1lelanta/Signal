import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { loginUser } from "../features/auth/authAPI";
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
      login(data.user, data.token);
      // If redirected from a protected route, go back there. Otherwise go to role-based dashboard
      const isGenericFrom = ["/", "/login", "/register"].includes(from);
      if (isGenericFrom) {
        if (data.user?.trustLevel === "moderator") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
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
  const DEMO_ADMIN = { email: "admin-demo@example.com", password: "Password123!" };
  const DEMO_USER = { email: "demo-user@example.com", password: "Password123!" };

  const useDemo = (creds) => {
    setForm({ email: creds.email, password: creds.password });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isWarm ? "bg-stone-100 text-slate-900" : "bg-slate-950 text-white"
      }`}
    >
      <div className="w-full max-w-md bg-slate-900 p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-400">Signal</h1>
          <p className="text-slate-300 mt-2">Welcome back! Please log in.</p>
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
            className="!bg-blue-600 hover:!bg-blue-700 !text-white border-0"
            style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="mt-6 p-3 rounded-md bg-slate-800/60 text-sm">
          <div className="flex items-center justify-between mb-2">
            <strong className="text-slate-100">Demo accounts</strong>
            <div className="flex gap-2">
              <button type="button" onClick={()=>useDemo(DEMO_USER)} className="text-xs px-2 py-1 bg-slate-700 rounded">Use Demo User</button>
              <button type="button" onClick={()=>useDemo(DEMO_ADMIN)} className="text-xs px-2 py-1 bg-amber-700 rounded">Use Admin</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <div>
              <div className="text-xs text-slate-400">User</div>
              <div className="text-sm">{DEMO_USER.email} / {DEMO_USER.password}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Admin</div>
              <div className="text-sm">{DEMO_ADMIN.email} / {DEMO_ADMIN.password}</div>
            </div>
          </div>
        </div>

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