"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface UploadModalProps {
  weekNumber: number;
  taskTitle: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function UploadModal({
  weekNumber,
  taskTitle,
  onClose,
  onSubmitted,
}: UploadModalProps) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("weekNumber", weekNumber.toString());
      formData.append("taskTitle", taskTitle);
      formData.append("description", description);
      formData.append("proof", file);

      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onSubmitted();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit");
      }
    } catch {
      alert("Failed to submit proof");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-lg p-7"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">
              Upload Proof
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-neon-cyan/50">
              Week {String(weekNumber).padStart(2, "0")}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Task */}
        <div className="mb-5 rounded-xl border border-white/[0.06] bg-surface-2 p-4">
          <p className="text-sm leading-relaxed text-white/60">{taskTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-300 ${
              dragActive
                ? "border-neon-cyan/50 bg-neon-cyan/[0.04] shadow-[0_0_40px_rgba(0,240,255,0.06)]"
                : file
                ? "border-neon-lime/20 bg-neon-lime/[0.03]"
                : "border-white/[0.08] hover:border-white/15 hover:bg-white/[0.02]"
            }`}
          >
            {file ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-neon-lime/10 shadow-[0_0_20px_rgba(57,255,20,0.08)]">
                  <svg className="h-7 w-7 text-neon-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-neon-lime/80">{file.name}</p>
                <p className="mt-1 text-xs text-white/25">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/[0.08] bg-surface-2">
                  <svg className="h-7 w-7 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-sm text-white/50">
                  Drop your file here or{" "}
                  <span className="font-bold text-neon-cyan">browse</span>
                </p>
                <p className="mt-2 text-[11px] text-white/25">
                  Images, PDFs, documents up to 10MB
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/30">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your implementation..."
              rows={3}
              className="glass-input w-full p-4 text-sm text-white placeholder-white/20"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 py-3.5 text-sm"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!file || loading}
              className="btn-primary flex-1 py-3.5 text-sm uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Proof"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
