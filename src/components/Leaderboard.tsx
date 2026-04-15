"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  id: string;
  name: string;
  totalPoints: number;
  weeksCompleted: number;
  submissionCount: number;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
        </div>
      </div>
    );
  }

  const maxPoints = entries.length > 0 ? entries[0].totalPoints : 1;

  return (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <div className="glass p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.02]">
            <svg className="h-7 w-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <p className="text-sm text-white/30">No participants yet. Be the first!</p>
        </div>
      ) : (
        entries.map((entry, index) => {
          const barWidth = maxPoints > 0 ? (entry.totalPoints / maxPoints) * 100 : 0;
          const isTop3 = index < 3;

          const rankConfig = [
            { gradient: "from-yellow-400 to-amber-500", glow: "shadow-[0_0_40px_rgba(251,191,36,0.15)]", text: "text-yellow-400", icon: "1ST" },
            { gradient: "from-gray-300 to-gray-400", glow: "shadow-[0_0_25px_rgba(156,163,175,0.1)]", text: "text-gray-300", icon: "2ND" },
            { gradient: "from-amber-600 to-amber-700", glow: "shadow-[0_0_25px_rgba(180,83,9,0.1)]", text: "text-amber-500", icon: "3RD" },
          ];

          const rank = rankConfig[index] || null;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.06,
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
              }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
              className={`glass overflow-hidden ${isTop3 && rank ? rank.glow : ""}`}
            >
              <div className="flex items-center gap-4 p-4 sm:p-5">
                {/* Rank Badge */}
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-[11px] font-black tracking-wider ${
                    rank
                      ? `bg-gradient-to-br ${rank.gradient} text-dark-950`
                      : "border border-white/[0.06] bg-white/[0.03] text-white/30"
                  }`}
                >
                  {rank ? rank.icon : index + 1}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold truncate ${rank ? rank.text : "text-white"}`}>
                      {entry.name}
                    </h4>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-[11px] text-white/25">
                    <span>{entry.weeksCompleted}/12 weeks</span>
                    <span>{entry.submissionCount} tasks</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5 progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: index * 0.06 + 0.3, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                      style={{
                        background: rank
                          ? index === 0
                            ? "linear-gradient(90deg, #b45309, #f59e0b, #fbbf24)"
                            : index === 1
                            ? "linear-gradient(90deg, #6b7280, #9ca3af, #d1d5db)"
                            : "linear-gradient(90deg, #78350f, #b45309, #d97706)"
                          : undefined,
                      }}
                    />
                  </div>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <span className={`text-3xl font-black ${rank ? rank.text : "text-gold-400"}`}>
                    {entry.totalPoints}
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-white/20">points</p>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
