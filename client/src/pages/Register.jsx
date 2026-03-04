import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { registerUser } from "../features/auth/authAPI";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await registerUser(form);
      // API returns { success, token, user }
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      console.error("Register failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-400">Signal</h1>
          <p className="text-slate-300 mt-2">Create your account to connect</p>
        </div>

        {error && (
          <p className="text-red-400 text-center mb-4 bg-red-900/20 p-3 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Username
            </label>
            <Input
              id="username"
              placeholder="Your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
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
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-300 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-400 hover:text-purple-300"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;