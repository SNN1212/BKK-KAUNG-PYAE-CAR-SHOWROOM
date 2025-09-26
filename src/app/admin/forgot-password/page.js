"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function AdminForgotPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <Image src="/login.jpg" alt="" fill priority className="object-cover -z-10" />
      <Link
        href="/admin/login"
        className="absolute left-4 top-4 inline-flex items-center gap-2 text-white no-underline hover:no-underline group"
      >
        <span aria-hidden>←</span>
        <span className="text-sm group-hover:underline underline-offset-2">Back to login</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 p-6 text-white">
        <h1 className="text-2xl font-semibold text-center">Reset Password</h1>

        <form className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm opacity-90">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="your username"
              className="w-full rounded-lg bg-white/15 text-white placeholder-white/60 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/40"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm opacity-90">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg bg-white/15 text-white placeholder-white/60 border border-white/20 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-white/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/10"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  {showPassword ? (
                    <path d="M3.98 8.223A10.477 10.477 0 0 0 1.5 12c2.065 3.685 6.045 6 10.5 6 1.846 0 3.597-.413 5.154-1.149l-2.08-2.08A7.462 7.462 0 0 1 12 15.75c-3.115 0-5.86-1.792-7.275-4.5a8.972 8.972 0 0 1 1.625-2.223l-2.37-2.804zM12 6.75c3.115 0 5.86 1.792 7.275 4.5a8.972 8.972 0 0 1-1.278 1.746l1.533 1.533A10.451 10.451 0 0 0 22.5 12c-2.065-3.685-6.045-6-10.5-6-.723 0-1.429.068-2.11.196l1.719 1.719c.127-.006.255-.015.391-.015z" />
                  ) : (
                    <path d="M12 6c-4.455 0-8.435 2.315-10.5 6 2.065 3.685 6.045 6 10.5 6s8.435-2.315 10.5-6c-2.065-3.685-6.045-6-10.5-6zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm opacity-90">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg bg-white/15 text-white placeholder-white/60 border border-white/20 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-white/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/10"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  {showConfirm ? (
                    <path d="M3.98 8.223A10.477 10.477 0 0 0 1.5 12c2.065 3.685 6.045 6 10.5 6 1.846 0 3.597-.413 5.154-1.149l-2.08-2.08A7.462 7.462 0 0 1 12 15.75c-3.115 0-5.86-1.792-7.275-4.5a8.972 8.972 0 0 1 1.625-2.223l-2.37-2.804zM12 6.75c3.115 0 5.86 1.792 7.275 4.5a8.972 8.972 0 0 1-1.278 1.746l1.533 1.533A10.451 10.451 0 0 0 22.5 12c-2.065-3.685-6.045-6-10.5-6-.723 0-1.429.068-2.11.196l1.719 1.719c.127-.006.255-.015.391-.015z" />
                  ) : (
                    <path d="M12 6c-4.455 0-8.435 2.315-10.5 6 2.065 3.685 6.045 6 10.5 6s8.435-2.315 10.5-6c-2.065-3.685-6.045-6-10.5-6zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" className="w-full rounded-lg bg-white/80 text-black font-medium py-2 hover:bg-white">
            Change password
          </button>
        </form>
      </div>
    </div>
  );
}


