"use client";

import { motion } from "framer-motion";
import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="orb orb-gold absolute -left-40 top-20 h-[500px] w-[500px]" />
      <div className="orb orb-purple absolute -right-40 bottom-0 h-[400px] w-[400px]" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="mb-10 text-center"
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold-400/50">
          Rankings
        </p>
        <h1 className="mb-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
          LEADERBOARD
        </h1>
        <p className="mx-auto max-w-md text-sm text-white/30">
          See how you rank against other participants in the VK & SIP Mentorship Program
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-white/25"
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" />
          <span>1st</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400" />
          <span>2nd</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700" />
          <span>3rd</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <Leaderboard />
      </motion.div>

      {/* Points Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="glass mt-10 p-7"
      >
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/60">
          How Points Work
        </h3>
        <ul className="space-y-3 text-sm text-white/35">
          {[
            "Each week has 3 tasks worth up to 10 points each (30 per week)",
            "Upload proof of implementation for each task to earn points",
            "Admins review submissions and award points based on quality",
            "Maximum total: 360 points across all 12 weeks",
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400/40" />
              {text}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
