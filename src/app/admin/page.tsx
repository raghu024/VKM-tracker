"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Submission {
  id: string;
  weekNumber: number;
  taskTitle: string;
  description: string;
  proofUrl: string;
  status: string;
  points: number;
  feedback: string | null;
  createdAt: string;
  user: { name: string; email: string };
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const } },
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) setSubmissions(await res.json());
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") { router.push("/dashboard"); return; }
      fetchSubmissions();
    }
  }, [status, session, router, fetchSubmissions]);

  const handleReview = async (id: string, newStatus: "approved" | "rejected", points: number, feedback: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, points, feedback }),
      });
      if (res.ok) fetchSubmissions();
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
        </div>
      </div>
    );
  }

  const filteredSubmissions = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);
  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  const filterConfig = [
    { key: "all" as const, color: "text-gold-400" },
    { key: "pending" as const, color: "text-yellow-400" },
    { key: "approved" as const, color: "text-green-400" },
    { key: "rejected" as const, color: "text-red-400" },
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="orb orb-purple absolute -right-40 top-10 h-[400px] w-[400px]" />

      <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={fadeUp} className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-gold-400/50">Administration</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Review Submissions
          </h1>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={fadeUp} className="mb-8 grid grid-cols-4 gap-3">
          {filterConfig.map((f) => (
            <motion.button
              key={f.key}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(f.key)}
              className={`glass p-4 text-center transition-all ${
                filter === f.key ? "border-gold-400/20 glow-gold-subtle" : ""
              }`}
            >
              <p className={`text-2xl font-black ${f.color}`}>{counts[f.key]}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-white/25 capitalize">
                {f.key}
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* Submissions */}
        <motion.div variants={fadeUp} className="space-y-3">
          {filteredSubmissions.length === 0 ? (
            <div className="glass p-16 text-center">
              <p className="text-sm text-white/25">No {filter} submissions</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredSubmissions.map((sub, i) => (
                <ReviewCard key={sub.id} submission={sub} index={i} onReview={handleReview} />
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ReviewCard({
  submission: sub,
  index,
  onReview,
}: {
  submission: Submission;
  index: number;
  onReview: (id: string, status: "approved" | "rejected", points: number, feedback: string) => void;
}) {
  const [points, setPoints] = useState(10);
  const [feedback, setFeedback] = useState("");
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="glass overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/15 bg-gold-400/[0.07] text-xs font-bold text-gold-400">
            W{sub.weekNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{sub.user.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                sub.status === "pending" ? "bg-yellow-400/10 text-yellow-300/70"
                : sub.status === "approved" ? "bg-green-400/10 text-green-300/70"
                : "bg-red-400/10 text-red-300/70"
              }`}>
                {sub.status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-white/25 line-clamp-1">{sub.taskTitle}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <svg className="h-5 w-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.04] p-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-white/20 mb-1">Task</p>
                  <p className="text-sm text-white/50">{sub.taskTitle}</p>
                </div>
                {sub.description && (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-white/20 mb-1">Description</p>
                    <p className="text-sm text-white/50">{sub.description}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {sub.proofUrl && (
                  <a href={sub.proofUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium text-gold-400 transition-colors hover:text-gold-300">
                    View proof file
                  </a>
                )}
                <span className="text-xs text-white/20">
                  {new Date(sub.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>

              {sub.status === "pending" && (
                <div className="space-y-3 border-t border-white/[0.04] pt-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-widest text-white/20">Points (0-10)</label>
                      <input
                        type="number" min={0} max={10} value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        className="glass-input w-20 p-2 text-center text-sm text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-widest text-white/20">Feedback</label>
                      <input
                        value={feedback} onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Optional feedback..."
                        className="glass-input w-full p-2 text-sm text-white placeholder-white/15"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => onReview(sub.id, "approved", points, feedback)}
                      className="rounded-xl bg-green-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-green-300 transition-colors hover:bg-green-500/20">
                      Approve ({points} pts)
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => onReview(sub.id, "rejected", 0, feedback)}
                      className="rounded-xl bg-red-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-red-300 transition-colors hover:bg-red-500/20">
                      Reject
                    </motion.button>
                  </div>
                </div>
              )}

              {sub.status !== "pending" && sub.feedback && (
                <div className="border-t border-white/[0.04] pt-3">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-white/20 mb-1">Feedback</p>
                  <p className="text-sm text-white/40">{sub.feedback}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
