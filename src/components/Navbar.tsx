"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="glass-nav sticky top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-18">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_0_20px_rgba(255,186,0,0.2)]"
            >
              <span className="text-lg font-black text-black">V</span>
            </motion.div>
            <div>
              <span className="text-gradient-gold text-lg font-black tracking-wide">
                VK & SIP
              </span>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
                Mentorship
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {[
              { href: "/", label: "Home" },
              ...(session
                ? [
                    { href: "/dashboard", label: "Dashboard" },
                    { href: "/leaderboard", label: "Leaderboard" },
                    ...(session.user.role === "admin"
                      ? [{ href: "/admin", label: "Admin" }]
                      : []),
                  ]
                : []),
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-surface-2 px-4 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600">
                    <span className="text-xs font-black text-black">
                      {session.user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    {session.user.name}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => signOut()}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm font-medium text-white/50 transition-all duration-300 hover:border-white/15 hover:text-white"
                >
                  Sign Out
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-all hover:text-white"
                >
                  Sign In
                </Link>
                <Link href="/auth/signup">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary inline-block px-5 py-2.5 text-sm"
                  >
                    Get Started
                  </motion.span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-white/50 md:hidden hover:bg-white/[0.05]"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden border-t border-white/[0.06] md:hidden"
            >
              <div className="space-y-1 py-4">
                <Link href="/" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/[0.05] hover:text-white">Home</Link>
                {session && (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/[0.05] hover:text-white">Dashboard</Link>
                    <Link href="/leaderboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/[0.05] hover:text-white">Leaderboard</Link>
                    {session.user.role === "admin" && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/[0.05] hover:text-white">Admin</Link>
                    )}
                    <button onClick={() => signOut()} className="mt-2 block w-full rounded-lg border border-white/[0.06] px-4 py-3 text-left text-sm text-white/50 hover:bg-white/[0.05]">Sign Out</button>
                  </>
                )}
                {!session && (
                  <div className="mt-3 flex gap-2 px-4">
                    <Link href="/auth/signin" className="rounded-lg px-4 py-2.5 text-sm text-white/50">Sign In</Link>
                    <Link href="/auth/signup" className="btn-primary rounded-lg px-5 py-2.5 text-sm">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
