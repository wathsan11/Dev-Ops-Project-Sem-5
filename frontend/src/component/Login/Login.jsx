import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8081/api/auth/login", {
        usernameOrEmail: username,
        password: password,
      });

      console.log(res);
      if (res.data.username) {
        setSuccess("Welcome back, " + res.data.username + "!");
        setError("");

        localStorage.setItem(
          "user",
          JSON.stringify({
            username: res.data.username,
            role: res.data.role,
          })
        );
        // Redirect or update app state here
      } else {
        setError(res.data.message || "Invalid Login");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response?.data || "Invalid credentials");
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
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-6">
          MyDiary Login 📓
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your diary account to continue journaling.
        </p>
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email or Username
            </label>
            <input
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-orange-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-orange-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-3 rounded-xl font-semibold hover:bg-orange-500 transition duration-300 shadow-md"
          >
            Log In
          </button>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <a href="#" className="text-orange-500 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
