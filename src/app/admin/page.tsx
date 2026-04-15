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
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
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
          <div className="h-14 w-14 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-2 border-transparent border-t-neon-cyan" />
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
    { key: "all" as const, label: "All", color: "text-neon-cyan", borderActive: "border-neon-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.06)]" },
    { key: "pending" as const, label: "Pending", color: "text-neon-orange", borderActive: "border-neon-orange/30 shadow-[0_0_30px_rgba(255,107,0,0.06)]" },
    { key: "approved" as const, label: "Approved", color: "text-neon-lime", borderActive: "border-neon-lime/30 shadow-[0_0_30px_rgba(57,255,20,0.06)]" },
    { key: "rejected" as const, label: "Rejected", color: "text-neon-pink", borderActive: "border-neon-pink/30 shadow-[0_0_30px_rgba(255,0,110,0.06)]" },
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="orb orb-purple absolute -right-40 top-10 h-[400px] w-[400px]" />

      <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={fadeUp} className="mb-12">
          <span className="tag-cyan mb-4 inline-block">Administration</span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Review <span className="text-gradient-gold">Submissions</span>
          </h1>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={fadeUp} className="mb-10 grid grid-cols-4 gap-3">
          {filterConfig.map((f) => (
            <motion.button
              key={f.key}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(f.key)}
              className={`rounded-2xl border p-5 text-center transition-all ${
                filter === f.key
                  ? `${f.borderActive} bg-gradient-to-b from-surface-2 to-surface-1`
                  : "border-white/[0.06] bg-surface-1 hover:border-white/10"
              }`}
            >
              <p className={`text-3xl font-black ${f.color}`}>{counts[f.key]}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/25">
                {f.label}
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* Submissions */}
        <motion.div variants={fadeUp} className="space-y-3">
          {filteredSubmissions.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-sm font-medium text-white/30">No {filter} submissions</p>
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

  const statusColors = {
    pending: "bg-neon-orange/10 text-neon-orange/80 border border-neon-orange/15",
    approved: "bg-neon-lime/10 text-neon-lime/80 border border-neon-lime/15",
    rejected: "bg-neon-pink/10 text-neon-pink/80 border border-neon-pink/15",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon-cyan/15 bg-neon-cyan/[0.06] text-xs font-black text-neon-cyan">
            W{sub.weekNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{sub.user.name}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[sub.status as keyof typeof statusColors] || statusColors.pending}`}>
                {sub.status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-white/30 line-clamp-1">{sub.taskTitle}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <svg className="h-5 w-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            <div className="border-t border-white/[0.06] p-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">Task</p>
                  <p className="text-sm text-white/50">{sub.taskTitle}</p>
                </div>
                {sub.description && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">Description</p>
                    <p className="text-sm text-white/50">{sub.description}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {sub.proofUrl && (
                  <a href={sub.proofUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-bold text-neon-cyan transition-colors hover:text-neon-cyan/70">
                    View proof file
                  </a>
                )}
                <span className="text-xs text-white/25">
                  {new Date(sub.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>

              {sub.status === "pending" && (
                <div className="space-y-4 border-t border-white/[0.06] pt-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-white/25">Points (0-10)</label>
                      <input
                        type="number" min={0} max={10} value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        className="glass-input w-20 p-2.5 text-center text-sm font-bold text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-white/25">Feedback</label>
                      <input
                        value={feedback} onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Optional feedback..."
                        className="glass-input w-full p-2.5 text-sm text-white placeholder-white/20"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => onReview(sub.id, "approved", points, feedback)}
                      className="rounded-xl border border-neon-lime/20 bg-neon-lime/[0.06] px-6 py-3 text-xs font-black uppercase tracking-wider text-neon-lime transition-all hover:bg-neon-lime/10 hover:shadow-[0_0_25px_rgba(57,255,20,0.08)]">
                      Approve ({points} pts)
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => onReview(sub.id, "rejected", 0, feedback)}
                      className="rounded-xl border border-neon-pink/20 bg-neon-pink/[0.06] px-6 py-3 text-xs font-black uppercase tracking-wider text-neon-pink transition-all hover:bg-neon-pink/10 hover:shadow-[0_0_25px_rgba(255,0,110,0.08)]">
                      Reject
                    </motion.button>
                  </div>
                </div>
              )}

              {sub.status !== "pending" && sub.feedback && (
                <div className="border-t border-white/[0.06] pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">Feedback</p>
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
