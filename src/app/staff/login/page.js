"use client";
import Link from "next/link";
import { useState } from "react";

export default function StaffLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Login
      const loginData = {
        email: formData.username, // Username field can contain email
        password: formData.password,
      };

      if (API_BASE_URL) {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        const result = await response.json();
        console.log("Staff login result:", result);

        if (response.ok && result.success !== false) {
          // Check if user is Staff role
          const user = result.user;
          if (user && user.role !== "Staff" && user.role !== "staff") {
            setMessage({ type: "error", text: "Access denied. Staff login only." });
            setLoading(false);
            return;
          }

          // Store user session and token
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          }
          if (result.token) {
            localStorage.setItem("token", result.token);
          }
          setMessage({ type: "success", text: result.message || "Login successful! Redirecting..." });
          setTimeout(() => {
            window.location.href = "/staff/dashboard";
          }, 1000);
        } else {
          setMessage({ type: "error", text: result.message || "Invalid credentials. Please try again." });
        }
      } else {
        // Fallback: Check localStorage for demo
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(
          (u) => (u.email === loginData.email || u.username === loginData.email) && u.password === loginData.password && (u.role === "Staff" || u.role === "staff")
        );

        if (user) {
          user.lastLogin = new Date().toISOString();
          localStorage.setItem("users", JSON.stringify(users));
          localStorage.setItem("user", JSON.stringify(user));
          setMessage({ type: "success", text: "Login successful! Redirecting..." });
          setTimeout(() => {
            window.location.href = "/staff/dashboard";
          }, 1000);
        } else {
          setMessage({ type: "error", text: "Invalid credentials or not a staff account." });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/login.png')" }}
    >
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 text-white no-underline hover:no-underline group"
      >
        <span aria-hidden>←</span>
        <span className="text-sm group-hover:underline underline-offset-2">Back to role selection</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 p-6 text-white">
        <h1 className="text-2xl font-semibold text-center">Staff Login</h1>

        {message.text && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-500/20 text-green-200 border border-green-500/30"
                : "bg-red-500/20 text-red-200 border border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm opacity-90">
              Username / Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="your username or email"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-white/15 text-white placeholder-white/60 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/40"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm opacity-90">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-white/15 text-white placeholder-white/60 border border-white/20 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-white/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/10 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  {showPassword ? (
                    <path d="M3.98 8.223A10.477 10.477 0 0 0 1.5 12c2.065 3.685 6.045 6 10.5 6 1.846 0 3.597-.413 5.154-1.149l-2.08-2.08A7.462 7.462 0 0 1 12 15.75c-3.115 0-5.86-1.792-7.275-4.5a8.972 8.972 0 0 1 1.625-2.223l-2.37-2.804zM12 6.75c3.115 0 5.86 1.792 7.275 4.5a8.972 8.972 0 0 1-1.278 1.746l1.533 1.533A10.451 10.451 0 0 0 22.5 12c-2.065-3.685-6.045-6-10.5-6-.723 0-1.429.068-2.11.196l1.719 1.719c.127-.006.255-.015.391-.015z" />
                  ) : (
                    <path d="M12 6c-4.455 0-8.435 2.315-10.5 6 2.065 3.685 6.045 6 10.5 6s8.435-2.315 10.5-6c-2.065-3.685-6.045-6-10.5-6zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white/80 text-black font-medium py-2 hover:bg-white hover:text-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
