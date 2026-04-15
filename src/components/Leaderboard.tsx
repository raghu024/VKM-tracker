"use client";

import { useEffect, useState } from "react";

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
      <div className="flex items-center justify-center py-12">
        <svg className="h-8 w-8 animate-spin text-gold-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const maxPoints = entries.length > 0 ? entries[0].totalPoints : 1;

  const getRankStyle = (rank: number) => {
    if (rank === 0)
      return {
        badge: "bg-gradient-to-r from-yellow-400 to-amber-500 text-dark-950",
        glow: "shadow-[0_0_30px_rgba(251,191,36,0.3)]",
        border: "border-yellow-400/40",
        icon: "👑",
      };
    if (rank === 1)
      return {
        badge: "bg-gradient-to-r from-gray-300 to-gray-400 text-dark-950",
        glow: "shadow-[0_0_20px_rgba(156,163,175,0.2)]",
        border: "border-gray-400/30",
        icon: "🥈",
      };
    if (rank === 2)
      return {
        badge: "bg-gradient-to-r from-amber-600 to-amber-700 text-white",
        glow: "shadow-[0_0_20px_rgba(180,83,9,0.2)]",
        border: "border-amber-600/30",
        icon: "🥉",
      };
    return {
      badge: "bg-dark-700 text-dark-300",
      glow: "",
      border: "border-dark-700",
      icon: "",
    };
  };

  return (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <p className="text-dark-400">No participants yet. Be the first to submit!</p>
        </div>
      ) : (
        entries.map((entry, index) => {
          const style = getRankStyle(index);
          const barWidth = maxPoints > 0 ? (entry.totalPoints / maxPoints) * 100 : 0;

          return (
            <div
              key={entry.id}
              className={`card-dark overflow-hidden transition-all duration-300 ${style.glow} ${
                index < 3 ? style.border : ""
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Rank */}
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold ${style.badge}`}
                >
                  {index < 3 ? style.icon : index + 1}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold truncate ${index === 0 ? "text-yellow-300" : "text-white"}`}>
                      {entry.name}
                    </h4>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-dark-400">
                    <span>{entry.weeksCompleted}/12 weeks</span>
                    <span>{entry.submissionCount} submissions</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-dark-700">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                          : index === 1
                          ? "bg-gradient-to-r from-gray-400 to-gray-300"
                          : index === 2
                          ? "bg-gradient-to-r from-amber-700 to-amber-500"
                          : "bg-gradient-to-r from-gold-600 to-gold-400"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <span
                    className={`text-2xl font-bold ${
                      index === 0 ? "text-yellow-400" : "text-gold-400"
                    }`}
                  >
                    {entry.totalPoints}
                  </span>
                  <p className="text-xs text-dark-400">points</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
