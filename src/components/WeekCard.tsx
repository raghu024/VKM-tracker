"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeekData } from "@/lib/weeks-data";
import UploadModal from "./UploadModal";

interface Submission {
  id: string;
  taskTitle: string;
  status: string;
  points: number;
  proofUrl: string;
  feedback?: string;
}

interface WeekCardProps {
  week: WeekData;
  submissions: Submission[];
  onSubmitted: () => void;
}

export default function WeekCard({ week, submissions, onSubmitted }: WeekCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [uploadTask, setUploadTask] = useState<string | null>(null);

  const earnedPoints = submissions
    .filter((s) => s.status === "approved")
    .reduce((sum, s) => sum + s.points, 0);

  const completedTasks = week.tasks.filter((task) =>
    submissions.some((s) => s.taskTitle === task && s.status === "approved")
  );

  const pendingTasks = week.tasks.filter((task) =>
    submissions.some((s) => s.taskTitle === task && s.status === "pending")
  );

  const progress = (completedTasks.length / week.tasks.length) * 100;

  const getTaskStatus = (task: string) => {
    const sub = submissions.find((s) => s.taskTitle === task);
    if (!sub) return "not_submitted";
    return sub.status;
  };

  const getTaskSubmission = (task: string) => {
    return submissions.find((s) => s.taskTitle === task);
  };

  return (
    <>
      <motion.div
        layout
        className="glass-gold overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border text-lg font-bold transition-all duration-300 ${
                progress === 100
                  ? "border-green-400/30 bg-green-400/10 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.1)]"
                  : "border-gold-400/20 bg-gold-400/[0.07] text-gold-400"
              }`}
            >
              {progress === 100 ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                String(week.week).padStart(2, "0")
              )}
            </motion.div>

            <div>
              <h3 className="text-base font-bold tracking-tight text-white">
                {week.sessionName}
              </h3>
              <p className="mt-0.5 text-xs text-white/30">
                {week.focusArea}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:inline-block ${
                week.sessionType === "Group Session"
                  ? "bg-blue-500/10 text-blue-300/60"
                  : "bg-purple-500/10 text-purple-300/60"
              }`}
            >
              {week.sessionType === "Group Session" ? "Group" : "1-on-1"}
            </span>

            <div className="text-right">
              <span className="text-xl font-black text-gold-400">
                {earnedPoints}
              </span>
              <span className="text-xs text-white/20">/{week.maxPoints}</span>
            </div>

            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <svg className="h-5 w-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </button>

        {/* Progress Bar */}
        <div className="px-5 pb-4">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-white/25">
            <span>{completedTasks.length}/{week.tasks.length} tasks</span>
            {pendingTasks.length > 0 && (
              <span className="text-yellow-400/60">{pendingTasks.length} pending</span>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/[0.04] p-5">
                <div className="space-y-3">
                  {week.tasks.map((task, i) => {
                    const status = getTaskStatus(task);
                    const submission = getTaskSubmission(task);

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="group flex items-start gap-3 rounded-2xl bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                      >
                        {/* Status Icon */}
                        <div className="mt-0.5 flex-shrink-0">
                          {status === "approved" && (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/15 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          {status === "pending" && (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-400">
                              <svg className="h-4 w-4 animate-spin" style={{ animationDuration: "3s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                          {status === "rejected" && (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          )}
                          {status === "not_submitted" && (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-white/20">
                              <span className="text-[11px] font-bold">{i + 1}</span>
                            </div>
                          )}
                        </div>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${status === "approved" ? "text-green-300/80" : "text-white/60"}`}>
                            {task}
                          </p>
                          {submission?.feedback && (
                            <div className="mt-2 rounded-xl bg-white/[0.03] p-3 text-xs text-white/40">
                              <span className="font-semibold text-gold-400/70">Feedback:</span>{" "}
                              {submission.feedback}
                            </div>
                          )}
                          {status === "approved" && submission && (
                            <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-gold-400/60">
                              +{submission.points} pts
                            </span>
                          )}
                        </div>

                        {/* Upload Button */}
                        {(status === "not_submitted" || status === "rejected") && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setUploadTask(task)}
                            className="btn-primary flex-shrink-0 px-4 py-2 text-xs tracking-wide uppercase"
                          >
                            {status === "rejected" ? "Retry" : "Upload"}
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadTask && (
          <UploadModal
            weekNumber={week.week}
            taskTitle={uploadTask}
            onClose={() => setUploadTask(null)}
            onSubmitted={() => {
              setUploadTask(null);
              onSubmitted();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
