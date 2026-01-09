import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function AuthPage({ setToken }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    const body = isLogin ? { email, password } : { username, email, password };
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        } else {
          setMessage(data.message || "Registration successful! Please login.");
          setIsLogin(true);
        }
      } else {
        setMessage(data.error || "Authentication failed");
      }
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C0A09]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#1C1917] border border-[#44403C] rounded-xl shadow-lg animate-fade-in">
        <h1 className="text-3xl font-extrabold text-center text-[#FACC15]">
          {isLogin ? "Login" : "Register"}
        </h1>
        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[#0C0A09] border border-[#44403C] text-[#FAFAF9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#0C0A09] border border-[#44403C] text-[#FAFAF9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#0C0A09] border border-[#44403C] text-[#FAFAF9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-black bg-[#FACC15] rounded-lg hover:bg-[#EAB308] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FACC15] transition-all duration-300"
          >
            {isLogin ? "Login" : "Register"}
          </button>
          {message && (
            <p className="mt-4 text-center text-red-500">{message}</p>
          )}
          <p className="mt-6 text-center text-[#A8A29E]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-[#FACC15] hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
