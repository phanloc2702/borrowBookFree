import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {authService}  from "../services/authService";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const res = await authService.login({ email, password });
      localStorage.setItem("token", res.token);
      navigate("/"); // chuyển hướng sau khi đăng nhập thành công
    } catch (error: any) {
      setError(error.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-white to-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-amber-500">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => {
                setError(null);
                
              }}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => {
                setError(null);
               
              }}
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200"
          >
            Login
          </button>
          
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-sm text-gray-400">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Login */}
        <button
          className="w-full py-2 flex items-center justify-center gap-2 border rounded-lg hover:bg-gray-50 transition"
          onClick={() => alert("Google login chưa tích hợp")}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>

        {/* Link register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
