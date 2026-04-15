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
        className={`overflow-hidden rounded-2xl border transition-all ${
          progress === 100
            ? "border-neon-lime/20 bg-gradient-to-r from-[#0d0d1a] to-[#0a1a0a]"
            : "border-gold-400/10 bg-gradient-to-r from-[#0d0d1a] to-[#15120a]"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }}
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-lg font-black transition-all duration-300 ${
                progress === 100
                  ? "border-neon-lime/30 bg-neon-lime/10 text-neon-lime shadow-[0_0_25px_rgba(57,255,20,0.1)]"
                  : "border-gold-400/20 bg-gold-400/[0.06] text-gold-400"
              }`}
            >
              {progress === 100 ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
              className={`hidden rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sm:inline-block ${
                week.sessionType === "Group Session"
                  ? "bg-neon-cyan/[0.06] text-neon-cyan/60 border border-neon-cyan/10"
                  : "bg-neon-purple/[0.06] text-neon-purple/60 border border-neon-purple/10"
              }`}
            >
              {week.sessionType === "Group Session" ? "Group" : "1-on-1"}
            </span>

            <div className="text-right">
              <span className="text-2xl font-black text-gold-400">
                {earnedPoints}
              </span>
              <span className="text-xs text-white/20">/{week.maxPoints}</span>
            </div>

            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] as const }}
            >
              <svg className="h-5 w-5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </button>

        {/* Progress Bar */}
        <div className="px-5 pb-4">
          <div className="progress-bar">
            <motion.div
              className={progress === 100 ? "h-full rounded-full bg-gradient-to-r from-green-500 to-neon-lime shadow-[0_0_12px_rgba(57,255,20,0.4)]" : "progress-fill"}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] as const }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-white/25">
            <span>{completedTasks.length}/{week.tasks.length} tasks</span>
            {pendingTasks.length > 0 && (
              <span className="text-neon-orange/70">{pendingTasks.length} pending review</span>
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
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] as const }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/[0.06] p-5">
                <div className="space-y-3">
                  {week.tasks.map((task, i) => {
                    const status = getTaskStatus(task);
                    const submission = getTaskSubmission(task);

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] as const }}
                        className={`group flex items-start gap-3 rounded-xl p-4 transition-colors ${
                          status === "approved"
                            ? "bg-neon-lime/[0.03] border border-neon-lime/10"
                            : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"
                        }`}
                      >
                        {/* Status Icon */}
                        <div className="mt-0.5 flex-shrink-0">
                          {status === "approved" && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-lime/15 text-neon-lime shadow-[0_0_12px_rgba(57,255,20,0.1)]">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          {status === "pending" && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-orange/15 text-neon-orange">
                              <svg className="h-4 w-4 animate-spin" style={{ animationDuration: "3s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                          {status === "rejected" && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-pink/15 text-neon-pink">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          )}
                          {status === "not_submitted" && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-surface-2 text-white/25">
                              <span className="text-[11px] font-bold">{i + 1}</span>
                            </div>
                          )}
                        </div>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium leading-relaxed ${status === "approved" ? "text-neon-lime/80" : "text-white/60"}`}>
                            {task}
                          </p>
                          {submission?.feedback && (
                            <div className="mt-2 rounded-lg border border-gold-400/10 bg-gold-400/[0.03] p-3 text-xs text-white/40">
                              <span className="font-bold text-gold-400/80">Feedback:</span>{" "}
                              {submission.feedback}
                            </div>
                          )}
                          {status === "approved" && submission && (
                            <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-gold-400">
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
                            className="btn-primary flex-shrink-0 px-5 py-2.5 text-xs tracking-wide uppercase"
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
