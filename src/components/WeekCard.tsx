"use client";

import { useState } from "react";
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
      <div className="card-dark overflow-hidden transition-all duration-300">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between p-5 text-left"
        >
          <div className="flex items-center gap-4">
            {/* Week Number Badge */}
            <div className="glow-gold-subtle flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gold-400/30 bg-gold-400/10">
              <span className="text-lg font-bold text-gold-400">
                {week.week}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                {week.sessionName}
              </h3>
              <p className="mt-0.5 text-sm text-dark-300">
                {week.focusArea}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Session Type Badge */}
            <span
              className={`hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-block ${
                week.sessionType === "Group Session"
                  ? "border border-blue-400/30 bg-blue-400/10 text-blue-300"
                  : "border border-purple-400/30 bg-purple-400/10 text-purple-300"
              }`}
            >
              {week.sessionType}
            </span>

            {/* Points */}
            <div className="text-right">
              <span className="text-lg font-bold text-gold-400">
                {earnedPoints}
              </span>
              <span className="text-sm text-dark-400">
                /{week.maxPoints}
              </span>
            </div>

            {/* Expand Arrow */}
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
          </div>
        </button>

        {/* Progress Bar */}
        <div className="px-5 pb-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-dark-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-dark-400">
            <span>
              {completedTasks.length}/{week.tasks.length} tasks completed
            </span>
            {pendingTasks.length > 0 && (
              <span className="text-yellow-400">
                {pendingTasks.length} pending review
              </span>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="border-t border-gold-400/10 p-5">
            <div className="space-y-3">
              {week.tasks.map((task, i) => {
                const status = getTaskStatus(task);
                const submission = getTaskSubmission(task);

                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg bg-dark-900/50 p-4"
                  >
                    {/* Status Icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      {status === "approved" && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {status === "pending" && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      {status === "rejected" && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      {status === "not_submitted" && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-dark-600 text-dark-400">
                          <span className="text-xs font-bold">{i + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Task Content */}
                    <div className="flex-1">
                      <p className={`text-sm ${status === "approved" ? "text-green-300" : "text-dark-200"}`}>
                        {task}
                      </p>
                      {submission?.feedback && (
                        <p className="mt-2 rounded bg-dark-800 p-2 text-xs text-dark-300">
                          <span className="font-semibold text-gold-400">Feedback:</span>{" "}
                          {submission.feedback}
                        </p>
                      )}
                      {status === "approved" && submission && (
                        <span className="mt-1 inline-block text-xs text-gold-400">
                          +{submission.points} points
                        </span>
                      )}
                    </div>

                    {/* Upload Button */}
                    {(status === "not_submitted" || status === "rejected") && (
                      <button
                        onClick={() => setUploadTask(task)}
                        className="flex-shrink-0 rounded-lg border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-xs font-medium text-gold-400 transition-all hover:bg-gold-400/20"
                      >
                        {status === "rejected" ? "Re-submit" : "Upload Proof"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
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
    </>
  );
}
