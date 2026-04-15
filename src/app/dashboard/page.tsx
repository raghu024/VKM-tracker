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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
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
          <div className="h-12 w-12 rounded-full border-2 border-white/[0.06]" />
          <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
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
    { value: totalEarned, label: "Points", sub: `/ ${totalPossible}`, color: "text-gold-400" },
    { value: approvedCount, label: "Approved", sub: "tasks", color: "text-green-400" },
    { value: pendingCount, label: "Pending", sub: "review", color: "text-yellow-400" },
    { value: weeksWithApproval, label: "Weeks", sub: "/ 12", color: "text-blue-400" },
  ];

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="orb orb-gold absolute -right-40 top-0 h-[400px] w-[400px]" />

      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-gold-400/50">Dashboard</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Welcome back,{" "}
            <span className="text-gradient-gold">{session.user.name}</span>
          </h1>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={fadeUp} className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass p-5 text-center"
            >
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-white/25">
                {stat.label} <span className="text-white/15">{stat.sub}</span>
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Overall Progress */}
        <motion.div variants={fadeUp} className="glass mb-10 p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-white/30">
              Overall Progress
            </span>
            <span className="text-2xl font-black text-white">
              {progressPct}<span className="text-sm text-white/30">%</span>
            </span>
          </div>
          <div className="progress-bar h-2">
            <motion.div
              className="progress-fill h-2"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Week Cards */}
        <motion.div variants={fadeUp}>
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-white/25">
            Weekly Sessions
          </p>
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
