import { useState } from "react";
import { useAuthStore } from "../context/authStore";

const Login = () => {
  const { login } = useAuthStore(); // Make sure `login` is used
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Simulating login with mock data
    login({ id: "123", name: "John Doe", email });

    console.log("User logged in:", email);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="border p-2 rounded-lg"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="border p-2 rounded-lg"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
