import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { registerUser } from "../features/auth/authAPI";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(form);
      // API returns { success, token, user }
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      console.error("Register failed", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 p-6 rounded-xl mt-20">
      <h2 className="text-xl font-bold mb-6 text-center">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button type="submit">Create Account</Button>
      </form>
    </div>
  );
};

export default Register;