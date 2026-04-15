"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      fetchSubmissions();
    }
  }, [status, router, fetchSubmissions]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="h-10 w-10 animate-spin text-gold-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!session) return null;

  const totalEarned = submissions
    .filter((s) => s.status === "approved")
    .reduce((sum, s) => sum + s.points, 0);

  const totalPossible = weeksData.reduce((sum, w) => sum + w.maxPoints, 0);

  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const weeksWithApproval = new Set(
    submissions.filter((s) => s.status === "approved").map((s) => s.weekNumber)
  ).size;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back,{" "}
          <span className="text-gradient-gold">{session.user.name}</span>
        </h1>
        <p className="mt-1 text-dark-400">
          Track your 12-week transformation journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-bold text-gold-400">{totalEarned}</p>
          <p className="mt-1 text-xs text-dark-400">
            Points Earned / {totalPossible}
          </p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{approvedCount}</p>
          <p className="mt-1 text-xs text-dark-400">Tasks Approved</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          <p className="mt-1 text-xs text-dark-400">Pending Review</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {weeksWithApproval}
          </p>
          <p className="mt-1 text-xs text-dark-400">Weeks Completed</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="card-dark mb-8 p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-dark-200">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-gold-400">
            {Math.round((totalEarned / totalPossible) * 100)}%
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-dark-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-1000"
            style={{
              width: `${(totalEarned / totalPossible) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Week Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Weekly Sessions</h2>
        {weeksData.map((week) => (
          <WeekCard
            key={week.week}
            week={week}
            submissions={submissions.filter(
              (s) => s.weekNumber === week.week
            )}
            onSubmitted={fetchSubmissions}
          />
        ))}
      </div>
    </div>
  );
}
