"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminLoginMutation } from "../../../store/api";
import { useAppDispatch } from "../../../store/hooks";
import { setCredentials } from "../../../store/slices/authSlice";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useAdminLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login({ email, password }).unwrap();
      const token = result.data.token;

      dispatch(setCredentials({ token, email }));

      if (typeof window !== "undefined") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminEmail", email);
      }

      router.push("/admin");
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        "Unable to login. Please check your credentials.";
      setError(message);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-gray-100 dark:ring-gray-800 px-8 py-10 sm:px-10 sm:py-12">
      <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
        Admin Login
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Sign in to manage TGHE dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 shadow-sm outline-none focus:border-[#ff4106] focus:ring-1 focus:ring-[#ff4106]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 shadow-sm outline-none focus:border-[#ff4106] focus:ring-1 focus:ring-[#ff4106] pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-xl bg-[#ff4106] px-4 py-3 text-sm font-black uppercase tracking-widest text-white shadow-md transition hover:bg-[#e33904] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

