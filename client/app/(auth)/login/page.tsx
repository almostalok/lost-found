"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const { login, isLoggingIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    try {
      await login({ email, password });
      router.push("/items");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to login. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center text-neutral-100 mb-6">Welcome Back</h1>
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-sm mb-4">
          {errorMsg}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-400 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full btn-primary mt-2 disabled:opacity-50 flex justify-center items-center"
        >
          {isLoggingIn ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-sm text-neutral-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-500 font-medium hover:text-blue-400 transition-colors">
          Sign up
        </Link>
      </p>
    </>
  );
}
