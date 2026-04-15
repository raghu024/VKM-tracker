"use client";

import { motion } from "framer-motion";
import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="orb orb-gold absolute -left-40 top-20 h-[500px] w-[500px]" />
      <div className="orb orb-purple absolute -right-40 bottom-0 h-[400px] w-[400px]" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 text-center"
      >
        <span className="tag-gold mb-4 inline-block">Rankings</span>
        <h1 className="mb-4 text-5xl font-black tracking-tight text-white sm:text-6xl">
          LEADER<span className="text-gradient-gold">BOARD</span>
        </h1>
        <p className="mx-auto max-w-md text-sm text-white/35">
          See how you rank against other participants in the VK & SIP Mentorship Program
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 flex flex-wrap items-center justify-center gap-6"
      >
        <div className="flex items-center gap-2">
          <div className="rank-1 h-4 w-4 rounded-md" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/30">1st</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="rank-2 h-4 w-4 rounded-md" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/30">2nd</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="rank-3 h-4 w-4 rounded-md" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/30">3rd</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Leaderboard />
      </motion.div>

      {/* Points Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="card mt-10 p-7"
      >
        <h3 className="mb-5 text-sm font-black uppercase tracking-widest text-white/60">
          How Points Work
        </h3>
        <ul className="space-y-3 text-sm text-white/40">
          {[
            "Each week has 3 tasks worth up to 10 points each (30 per week)",
            "Upload proof of implementation for each task to earn points",
            "Admins review submissions and award points based on quality",
            "Maximum total: 360 points across all 12 weeks",
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gold-400/50" />
              {text}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
