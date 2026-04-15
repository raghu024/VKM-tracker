"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

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
  user: {
    name: string;
    email: string;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      fetchSubmissions();
    }
  }, [status, session, router, fetchSubmissions]);

  const handleReview = async (
    id: string,
    newStatus: "approved" | "rejected",
    points: number,
    feedback: string
  ) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, points, feedback }),
      });

      if (res.ok) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

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

  const filteredSubmissions =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-gradient-gold text-2xl font-bold">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-dark-400">
          Review and approve client submissions
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`card-dark p-3 text-center transition-all ${
              filter === f ? "border-gold-400/50 glow-gold-subtle" : ""
            }`}
          >
            <p
              className={`text-xl font-bold ${
                f === "pending"
                  ? "text-yellow-400"
                  : f === "approved"
                  ? "text-green-400"
                  : f === "rejected"
                  ? "text-red-400"
                  : "text-gold-400"
              }`}
            >
              {counts[f]}
            </p>
            <p className="mt-0.5 text-xs capitalize text-dark-400">{f}</p>
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="card-dark p-12 text-center">
            <p className="text-dark-400">No {filter} submissions found</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => (
            <SubmissionReviewCard
              key={sub.id}
              submission={sub}
              onReview={handleReview}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SubmissionReviewCard({
  submission,
  onReview,
}: {
  submission: Submission;
  onReview: (
    id: string,
    status: "approved" | "rejected",
    points: number,
    feedback: string
  ) => void;
}) {
  const [points, setPoints] = useState(10);
  const [feedback, setFeedback] = useState("");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card-dark overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold-400/30 bg-gold-400/10">
            <span className="text-sm font-bold text-gold-400">
              W{submission.weekNumber}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">
                {submission.user.name}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  submission.status === "pending"
                    ? "bg-yellow-400/10 text-yellow-300"
                    : submission.status === "approved"
                    ? "bg-green-400/10 text-green-300"
                    : "bg-red-400/10 text-red-300"
                }`}
              >
                {submission.status}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-dark-400 line-clamp-1">
              {submission.taskTitle}
            </p>
          </div>
        </div>
        <svg
          className={`h-5 w-5 text-dark-400 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-gold-400/10 p-4">
          <div className="mb-4 space-y-3">
            <div>
              <span className="text-xs font-medium text-dark-400">Task</span>
              <p className="text-sm text-dark-200">{submission.taskTitle}</p>
            </div>
            {submission.description && (
              <div>
                <span className="text-xs font-medium text-dark-400">
                  Description
                </span>
                <p className="text-sm text-dark-200">
                  {submission.description}
                </p>
              </div>
            )}
            {submission.proofUrl && (
              <div>
                <span className="text-xs font-medium text-dark-400">
                  Proof
                </span>
                <a
                  href={submission.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-gold-400 hover:text-gold-300"
                >
                  View uploaded file
                </a>
              </div>
            )}
            <div>
              <span className="text-xs font-medium text-dark-400">
                Submitted
              </span>
              <p className="text-sm text-dark-200">
                {new Date(submission.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {submission.status === "pending" && (
            <div className="space-y-3 border-t border-dark-700 pt-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-dark-400">
                  Points (0-10)
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="w-24 rounded-lg border border-dark-600 bg-dark-900/50 p-2 text-sm text-white focus:border-gold-400/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-dark-400">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Optional feedback for the client..."
                  rows={2}
                  className="w-full rounded-lg border border-dark-600 bg-dark-900/50 p-2 text-sm text-white placeholder-dark-500 focus:border-gold-400/50 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onReview(submission.id, "approved", points, feedback)
                  }
                  className="rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-500/30"
                >
                  Approve ({points} pts)
                </button>
                <button
                  onClick={() =>
                    onReview(submission.id, "rejected", 0, feedback)
                  }
                  className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {submission.status !== "pending" && submission.feedback && (
            <div className="border-t border-dark-700 pt-3">
              <span className="text-xs font-medium text-dark-400">
                Feedback
              </span>
              <p className="text-sm text-dark-300">{submission.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
