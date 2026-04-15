import Link from "next/link";
import { weeksData } from "@/lib/weeks-data";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gold-400/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gold-400/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-medium text-gold-300">
              12-Week Business Transformation Journey
            </span>
          </div>

          <h1 className="text-gradient-gold mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            VK & SIP Mentorship Roadmap
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-dark-300">
            Transform your business in 12 weeks. Complete weekly tasks, upload
            proof of your implementation, earn points, and compete with fellow
            entrepreneurs on the leaderboard.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="glow-gold inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 px-8 py-3.5 text-sm font-semibold text-dark-950 transition-all hover:from-gold-500 hover:to-gold-300"
            >
              Start Your Journey
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 rounded-xl border border-gold-400/20 bg-gold-400/5 px-8 py-3.5 text-sm font-semibold text-gold-400 transition-all hover:bg-gold-400/10"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-gradient-gold mb-12 text-center text-3xl font-bold">
            How It Works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Complete Weekly Tasks",
                desc: "Each week has specific implementation tasks aligned with your business transformation goals.",
              },
              {
                step: "2",
                title: "Upload Proof",
                desc: "Submit screenshots, documents, or recordings as proof of your implementation.",
              },
              {
                step: "3",
                title: "Earn Points & Rank Up",
                desc: "Get points for approved submissions and climb the leaderboard against other clients.",
              },
            ].map((item) => (
              <div key={item.step} className="card-dark p-6 text-center">
                <div className="glow-gold-subtle mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold-400/30 bg-gold-400/10">
                  <span className="text-lg font-bold text-gold-400">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-dark-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12-Week Overview */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-gradient-gold mb-4 text-center text-3xl font-bold">
            12-Week Program Overview
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-dark-400">
            A structured journey covering lifestyle, strategy, marketing, and sales
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weeksData.map((week) => (
              <div
                key={week.week}
                className="card-dark group overflow-hidden p-5 transition-all duration-300 hover:border-gold-400/40"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-400/30 bg-gold-400/10 text-sm font-bold text-gold-400">
                      {week.week}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        week.sessionType === "Group Session"
                          ? "border border-blue-400/20 bg-blue-400/10 text-blue-300"
                          : "border border-purple-400/20 bg-purple-400/10 text-purple-300"
                      }`}
                    >
                      {week.sessionType}
                    </span>
                  </div>
                  <span className="text-xs text-gold-400/60">
                    {week.maxPoints} pts
                  </span>
                </div>
                <h3 className="mb-1 font-semibold text-white group-hover:text-gold-300 transition-colors">
                  {week.sessionName}
                </h3>
                <p className="text-sm text-dark-400">{week.focusArea}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="mb-4 text-dark-400">
              Total available points:{" "}
              <span className="text-xl font-bold text-gold-400">
                {weeksData.reduce((sum, w) => sum + w.maxPoints, 0)}
              </span>
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 px-6 py-3 text-sm font-semibold text-dark-950 transition-all hover:from-gold-500 hover:to-gold-300"
            >
              Join the Program
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
