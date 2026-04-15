"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        router.push("/auth/signin");
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
    <div className="relative flex min-h-[85vh] items-center justify-center px-4">
      <div className="orb orb-gold absolute right-[10%] top-[10%] h-[400px] w-[400px]" />
      <div className="orb orb-blue absolute left-[5%] bottom-[20%] h-[300px] w-[300px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="glass w-full max-w-md p-8 sm:p-10"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="glow-gold-subtle mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-gold-400/20 bg-gold-400/10"
          >
            <span className="text-2xl font-black text-gold-400">V</span>
          </motion.div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Join the Program
          </h1>
          <p className="mt-2 text-sm text-white/30">
            Start your 12-week transformation
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-2xl border border-red-400/10 bg-red-400/[0.05] p-4 text-center text-sm text-red-300/80"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/30">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="glass-input w-full p-4 text-sm text-white placeholder-white/20"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/30">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-input w-full p-4 text-sm text-white placeholder-white/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/30">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="glass-input w-full p-4 text-sm text-white placeholder-white/20"
              placeholder="Minimum 6 characters"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-sm uppercase tracking-wide disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </motion.button>
        </form>

        <p className="mt-7 text-center text-sm text-white/25">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-gold-400 transition-colors hover:text-gold-300">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
