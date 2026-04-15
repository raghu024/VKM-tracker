"use client";

import { useState, useRef } from "react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card-dark w-full max-w-lg p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Upload Proof of Implementation
            </h3>
            <p className="mt-1 text-sm text-dark-400">Week {weekNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-dark-400 hover:bg-dark-700 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Task */}
        <div className="mb-4 rounded-lg bg-dark-900/50 p-3">
          <p className="text-sm text-dark-200">{taskTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
              dragActive
                ? "border-gold-400 bg-gold-400/10"
                : file
                ? "border-green-400/30 bg-green-400/5"
                : "border-dark-600 hover:border-gold-400/30 hover:bg-dark-800"
            }`}
          >
            {file ? (
              <>
                <svg className="mb-2 h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-300">{file.name}</p>
                <p className="mt-1 text-xs text-dark-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <svg className="mb-2 h-8 w-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-dark-300">
                  Drag & drop your proof here, or{" "}
                  <span className="text-gold-400">browse</span>
                </p>
                <p className="mt-1 text-xs text-dark-500">
                  Images, PDFs, or documents up to 10MB
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
            <label className="mb-1.5 block text-sm font-medium text-dark-200">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your implementation..."
              rows={3}
              className="w-full rounded-lg border border-dark-600 bg-dark-900/50 p-3 text-sm text-white placeholder-dark-500 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-dark-600 px-4 py-2.5 text-sm text-dark-300 transition-colors hover:bg-dark-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-gold-600 to-gold-400 px-4 py-2.5 text-sm font-semibold text-dark-950 transition-all hover:from-gold-500 hover:to-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
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
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
