"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { weeksData } from "@/lib/weeks-data";
import WeekCard from "@/components/WeekCard";

interface Submission {
  id: string;
  weekNumber: number;
  taskTitle: string;
  status: string;
  points: number;
  proofUrl: string;
  feedback?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) setSubmissions(await res.json());
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated") fetchSubmissions();
  }, [status, router, fetchSubmissions]);

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

  if (!session) return null;

  const totalEarned = submissions.filter((s) => s.status === "approved").reduce((sum, s) => sum + s.points, 0);
  const totalPossible = weeksData.reduce((sum, w) => sum + w.maxPoints, 0);
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const weeksWithApproval = new Set(submissions.filter((s) => s.status === "approved").map((s) => s.weekNumber)).size;
  const progressPct = Math.round((totalEarned / totalPossible) * 100);

  const stats = [
    { value: totalEarned, label: "Points", sub: `/ ${totalPossible}`, color: "text-gold-400", borderColor: "border-gold-400/15", bgColor: "bg-gold-400/[0.04]" },
    { value: approvedCount, label: "Approved", sub: "tasks", color: "text-neon-lime", borderColor: "border-neon-lime/15", bgColor: "bg-neon-lime/[0.04]" },
    { value: pendingCount, label: "Pending", sub: "review", color: "text-neon-orange", borderColor: "border-neon-orange/15", bgColor: "bg-neon-orange/[0.04]" },
    { value: weeksWithApproval, label: "Weeks", sub: "/ 12", color: "text-neon-cyan", borderColor: "border-neon-cyan/15", bgColor: "bg-neon-cyan/[0.04]" },
  ];

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="orb orb-cyan absolute -right-40 top-0 h-[400px] w-[400px]" />

      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-12">
          <span className="tag-cyan mb-4 inline-block">Dashboard</span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Welcome back,{" "}
            <span className="text-gradient-gold">{session.user.name}</span>
          </h1>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={fadeUp} className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`rounded-2xl border ${stat.borderColor} ${stat.bgColor} bg-surface-1 p-6 text-center transition-all`}
              style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #111125 100%)" }}
            >
              <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-white/25">
                {stat.label} <span className="text-white/15">{stat.sub}</span>
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Overall Progress */}
        <motion.div variants={fadeUp} className="card mb-12 p-7">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-white/30">
              Overall Progress
            </span>
            <span className="text-3xl font-black text-white">
              {progressPct}<span className="text-sm font-bold text-white/30">%</span>
            </span>
          </div>
          <div className="progress-bar h-3">
            <motion.div
              className="progress-fill h-3"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-white/20">
            <span>{totalEarned} points earned</span>
            <span>{totalPossible - totalEarned} points remaining</span>
          </div>
        </motion.div>

        {/* Week Cards */}
        <motion.div variants={fadeUp}>
          <div className="mb-6 flex items-center justify-between">
            <span className="tag-gold">Weekly Sessions</span>
            <span className="text-xs font-medium text-white/20">{weeksData.length} weeks</span>
          </div>
          <div className="space-y-4">
            {weeksData.map((week) => (
              <WeekCard
                key={week.week}
                week={week}
                submissions={submissions.filter((s) => s.weekNumber === week.week)}
                onSubmitted={fetchSubmissions}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
