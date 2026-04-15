"use client";

import Link from "next/link";
import { weeksData } from "@/lib/weeks-data";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const },
  },
};

export default function Home() {
  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4">
        {/* Orbs */}
        <div className="orb orb-gold absolute -top-20 right-[10%] h-[500px] w-[500px]" />
        <div className="orb orb-purple absolute bottom-0 left-[5%] h-[400px] w-[400px]" style={{ animationDelay: "5s" }} />
        <div className="orb orb-blue absolute top-[40%] right-[30%] h-[300px] w-[300px]" style={{ animationDelay: "10s" }} />

        {/* Rotating ring decoration */}
        <div className="animate-rotate-slow pointer-events-none absolute h-[600px] w-[600px] rounded-full border border-gold-400/[0.04] sm:h-[800px] sm:w-[800px]" />
        <div className="animate-rotate-slow pointer-events-none absolute h-[400px] w-[400px] rounded-full border border-white/[0.03] sm:h-[600px] sm:w-[600px]" style={{ animationDirection: "reverse", animationDuration: "45s" }} />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative mx-auto max-w-5xl text-center"
        >
          {/* Tag */}
          <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
            </span>
            <span className="text-xs font-medium tracking-widest text-white/50 uppercase">
              12-Week Business Transformation
            </span>
          </motion.div>

          {/* Main heading - Nike-style bold */}
          <motion.h1
            variants={fadeUp}
            className="mb-6 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            <span className="block">TRANSFORM</span>
            <span className="text-gradient-gold block">YOUR BUSINESS</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mb-12 max-w-xl text-base leading-relaxed text-white/40 sm:text-lg"
          >
            Complete weekly tasks. Upload proof of implementation.
            Earn points. Dominate the leaderboard.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/signup">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-primary inline-flex items-center gap-2.5 px-8 py-4 text-sm tracking-wide uppercase"
              >
                Start Your Journey
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.span>
            </Link>
            <Link href="/leaderboard">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-ghost inline-flex items-center gap-2.5 px-8 py-4 text-sm tracking-wide uppercase"
              >
                View Leaderboard
              </motion.span>
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            variants={fadeUp}
            className="glass mx-auto mt-16 grid max-w-lg grid-cols-3 divide-x divide-white/[0.04] p-1"
          >
            {[
              { value: "12", label: "Weeks" },
              { value: "36", label: "Tasks" },
              { value: "360", label: "Points" },
            ].map((stat) => (
              <div key={stat.label} className="py-4 text-center">
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-widest text-white/30">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="relative py-28">
        <div className="orb orb-gold absolute -right-20 top-0 h-[400px] w-[400px]" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="mb-3 text-center text-xs font-medium uppercase tracking-[0.3em] text-gold-400/60">
              The Process
            </motion.p>
            <motion.h2 variants={fadeUp} className="mb-16 text-center text-4xl font-black tracking-tight text-white sm:text-5xl">
              HOW IT WORKS
            </motion.h2>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "IMPLEMENT",
                  desc: "Each week has specific tasks aligned with your business transformation goals. Take action.",
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ),
                },
                {
                  step: "02",
                  title: "PROVE IT",
                  desc: "Upload screenshots, documents, or recordings as evidence of your implementation.",
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  ),
                },
                {
                  step: "03",
                  title: "DOMINATE",
                  desc: "Earn points for approved work and climb the leaderboard to the top.",
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 9H11.25A3.375 3.375 0 007.5 14.25v4.5m9 0H7.5M12 2.25l3.75 3.75L12 9.75 8.25 6 12 2.25z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  variants={scaleIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="glass-gold group relative overflow-hidden p-8"
                >
                  {/* Step number background */}
                  <span className="pointer-events-none absolute -right-4 -top-4 text-[120px] font-black leading-none text-white/[0.02] transition-all duration-500 group-hover:text-gold-400/[0.04]">
                    {item.step}
                  </span>

                  <div className="relative">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/20 bg-gold-400/10 text-gold-400 transition-all duration-300 group-hover:border-gold-400/40 group-hover:shadow-[0_0_30px_rgba(212,160,33,0.15)]">
                      {item.icon}
                    </div>
                    <p className="mb-1 text-xs font-medium tracking-[0.2em] text-gold-400/50">
                      STEP {item.step}
                    </p>
                    <h3 className="mb-3 text-xl font-bold tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/40">{item.desc}</p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-gold-400/60 to-transparent transition-all duration-500 group-hover:w-full" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 12-WEEK PROGRAM ═══ */}
      <section className="relative py-28">
        <div className="orb orb-purple absolute left-[10%] top-[20%] h-[500px] w-[500px]" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="mb-3 text-center text-xs font-medium uppercase tracking-[0.3em] text-gold-400/60">
              The Roadmap
            </motion.p>
            <motion.h2 variants={fadeUp} className="mb-4 text-center text-4xl font-black tracking-tight text-white sm:text-5xl">
              12 WEEKS OF<br />
              <span className="text-gradient-gold">TRANSFORMATION</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mb-16 max-w-md text-center text-sm text-white/30">
              A structured journey covering lifestyle, strategy, marketing, and sales mastery
            </motion.p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {weeksData.map((week, i) => (
                <motion.div
                  key={week.week}
                  variants={scaleIn}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="glass group relative overflow-hidden p-6"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  {/* Week number watermark */}
                  <span className="pointer-events-none absolute -right-2 -top-2 text-[80px] font-black leading-none text-white/[0.015] transition-all duration-500 group-hover:text-gold-400/[0.04]">
                    {String(week.week).padStart(2, "0")}
                  </span>

                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/15 bg-gold-400/[0.07] text-sm font-bold text-gold-400 transition-all group-hover:border-gold-400/30 group-hover:shadow-[0_0_20px_rgba(212,160,33,0.1)]">
                          {String(week.week).padStart(2, "0")}
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            week.sessionType === "Group Session"
                              ? "bg-blue-500/10 text-blue-300/70"
                              : "bg-purple-500/10 text-purple-300/70"
                          }`}
                        >
                          {week.sessionType === "Group Session" ? "Group" : "1-on-1"}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gold-400/40">
                        {week.maxPoints}pt
                      </span>
                    </div>
                    <h3 className="mb-1.5 text-sm font-bold tracking-tight text-white transition-colors group-hover:text-gold-300">
                      {week.sessionName}
                    </h3>
                    <p className="text-xs leading-relaxed text-white/30">{week.focusArea}</p>
                  </div>

                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-gold-400/50 to-transparent transition-all duration-500 group-hover:w-full" />
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div variants={fadeUp} className="mt-16 text-center">
              <p className="mb-6 text-white/30">
                Total available:{" "}
                <span className="text-3xl font-black text-white">
                  {weeksData.reduce((sum, w) => sum + w.maxPoints, 0)}
                </span>
                <span className="ml-1 text-xs uppercase tracking-widest text-gold-400/50">points</span>
              </p>
              <Link href="/auth/signup">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn-primary inline-flex items-center gap-2.5 px-8 py-4 text-sm tracking-wide uppercase"
                >
                  Join Now
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
