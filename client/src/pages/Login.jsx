import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 p-6 rounded-xl mt-20">
      <h2 className="text-xl font-bold mb-6 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;