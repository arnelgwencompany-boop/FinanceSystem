import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Prototype only (no backend)
    if (username && password) {
      navigate("/dashboard");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-4">
          IT Petty Cash System
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}