import axios from "axios";
import api from '../../api'
import React, { useState } from "react";

const SignUp = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await api.post("/api/auth/signup", {
        username,
        email,
        password,
      });

      setSuccess(typeof res.data === "string" ? res.data : "Registered successfully!");
      setError("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirm("");

      setTimeout(() => {
        onSwitchToLogin && onSwitchToLogin('login');
      }, 1000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data || "Signup failed");
      } else if (err.request) {
        setError("Network error. Please check if the server is running.");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-orange-200">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-6">Create Account</h1>
        <p className="text-center text-gray-600 mb-8">Create your diary account to start journaling.</p>

        {success && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded mb-4">{success}</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-orange-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-orange-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-orange-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-orange-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50"
              required
            />
          </div>

          <button type="submit" className="w-full bg-orange-400 text-white py-3 rounded-xl font-semibold hover:bg-orange-500 transition duration-300 shadow-md">Sign Up</button>

          <p className="text-center text-gray-600 text-sm">Already have an account? <button type="button" onClick={() => onSwitchToLogin && onSwitchToLogin('login')} className="text-orange-500 hover:underline font-medium">Log in</button></p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
