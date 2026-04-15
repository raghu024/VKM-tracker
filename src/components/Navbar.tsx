"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gold-400/20 bg-dark-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold-400/30 bg-gold-400/10">
              <span className="text-lg font-bold text-gold-400">V</span>
            </div>
            <div>
              <span className="text-gradient-gold text-lg font-bold tracking-wide">
                VK & SIP
              </span>
              <p className="text-[10px] uppercase tracking-widest text-gold-300/60">
                Mentorship Program
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm text-dark-200 transition-colors hover:bg-gold-400/10 hover:text-gold-300"
            >
              Home
            </Link>
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-4 py-2 text-sm text-dark-200 transition-colors hover:bg-gold-400/10 hover:text-gold-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/leaderboard"
                  className="rounded-lg px-4 py-2 text-sm text-dark-200 transition-colors hover:bg-gold-400/10 hover:text-gold-300"
                >
                  Leaderboard
                </Link>
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-lg px-4 py-2 text-sm text-dark-200 transition-colors hover:bg-gold-400/10 hover:text-gold-300"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
                  <span className="text-sm font-semibold text-gold-400">
                    {session.user.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-dark-200">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="rounded-lg border border-gold-400/20 px-4 py-2 text-sm text-gold-400 transition-colors hover:bg-gold-400/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="rounded-lg px-4 py-2 text-sm text-dark-200 transition-colors hover:text-gold-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="glow-gold-subtle rounded-lg bg-gold-400/10 px-4 py-2 text-sm font-semibold text-gold-400 transition-all hover:bg-gold-400/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-dark-200 md:hidden hover:bg-gold-400/10"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t border-gold-400/10 py-3 md:hidden">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-2 text-sm text-dark-200 hover:bg-gold-400/10">Home</Link>
            {session && (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-2 text-sm text-dark-200 hover:bg-gold-400/10">Dashboard</Link>
                <Link href="/leaderboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-2 text-sm text-dark-200 hover:bg-gold-400/10">Leaderboard</Link>
                {session.user.role === "admin" && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-2 text-sm text-dark-200 hover:bg-gold-400/10">Admin</Link>
                )}
                <button onClick={() => signOut()} className="mt-2 block w-full rounded-lg border border-gold-400/20 px-4 py-2 text-left text-sm text-gold-400 hover:bg-gold-400/10">Sign Out</button>
              </>
            )}
            {!session && (
              <div className="mt-2 flex gap-2 px-4">
                <Link href="/auth/signin" className="rounded-lg px-4 py-2 text-sm text-dark-200 hover:text-gold-300">Sign In</Link>
                <Link href="/auth/signup" className="rounded-lg bg-gold-400/10 px-4 py-2 text-sm font-semibold text-gold-400">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
