"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="card-dark w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="glow-gold mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10">
            <span className="text-2xl font-bold text-gold-400">V</span>
          </div>
          <h1 className="text-gradient-gold text-2xl font-bold">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-dark-400">
            Sign in to continue your transformation journey
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-dark-600 bg-dark-900/50 p-3 text-sm text-white placeholder-dark-500 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-dark-600 bg-dark-900/50 p-3 text-sm text-white placeholder-dark-500 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-gold-600 to-gold-400 py-3 text-sm font-semibold text-dark-950 transition-all hover:from-gold-500 hover:to-gold-300 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-gold-400 hover:text-gold-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
