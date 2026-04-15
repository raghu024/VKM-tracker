"use client";

import Link from "next/link";
import { weeksData } from "@/lib/weeks-data";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* Animated Counter */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* Scroll-triggered Reveal */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <div className="relative">
      {/* ═══════════════════════════════════════
          HERO — MASSIVE, CINEMATIC
          ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Neon orbs */}
        <div className="orb orb-cyan absolute -top-20 left-[5%] h-[600px] w-[600px]" />
        <div className="orb orb-purple absolute bottom-[-10%] right-[0%] h-[500px] w-[500px]" style={{ animationDelay: "5s" }} />
        <div className="orb orb-gold absolute top-[40%] right-[20%] h-[300px] w-[300px]" style={{ animationDelay: "10s" }} />

        {/* Decorative rings */}
        <div className="animate-rotate-slow pointer-events-none absolute h-[600px] w-[600px] rounded-full border border-white/[0.03] sm:h-[800px] sm:w-[800px]" />
        <div className="animate-rotate-slow pointer-events-none absolute h-[400px] w-[400px] rounded-full border border-neon-cyan/[0.05] sm:h-[600px] sm:w-[600px]" style={{ animationDirection: "reverse", animationDuration: "45s" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="relative z-10 mx-auto max-w-6xl px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-10"
          >
            <span className="tag-cyan inline-flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
              </span>
              12-Week Business Program
            </span>
          </motion.div>

          {/* GIANT HEADLINE */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.5rem,14vw,12rem)] font-black leading-[0.85] tracking-tighter text-white"
            >
              TRANSFORM
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-gradient-gold text-[clamp(3.5rem,14vw,12rem)] font-black leading-[0.85] tracking-tighter"
            >
              YOUR BUSINESS
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mx-auto mt-10 max-w-lg text-lg text-white/50 sm:text-xl"
          >
            Complete tasks. Upload proof. Earn points.
            <br />
            <span className="text-neon-cyan font-semibold">Dominate the leaderboard.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/auth/signup">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-3 px-10 py-5 text-sm tracking-[0.15em] uppercase"
              >
                Get Started
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.span>
            </Link>
            <Link href="/leaderboard">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-ghost inline-flex items-center gap-3 px-10 py-5 text-sm tracking-[0.15em] uppercase"
              >
                View Leaderboard
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-neon-cyan/40 uppercase">Scroll</span>
            <div className="h-12 w-[2px] bg-gradient-to-b from-neon-cyan/30 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          MARQUEE TICKER — NEON STYLE
          ═══════════════════════════════════════ */}
      <div className="section-accent py-5">
        <div className="marquee">
          <div className="marquee-content">
            {Array(3).fill(null).map((_, rep) => (
              <div key={rep} className="flex items-center gap-10 px-5">
                {["LIFESTYLE", "GOALS", "STRATEGY", "MARKETING", "SALES", "CULTURE", "GROWTH", "LEADERSHIP"].map((word) => (
                  <span key={`${rep}-${word}`} className="whitespace-nowrap text-sm font-extrabold tracking-[0.3em] text-white/10 uppercase">
                    {word}
                    <span className="mx-5 inline-block h-2 w-2 rounded-full bg-neon-cyan/20" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          STATS — BIG NEON NUMBERS
          ═══════════════════════════════════════ */}
      <section className="section-elevated py-32">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: 12, label: "WEEKS", color: "text-neon-cyan", suffix: "" },
                { value: 36, label: "TASKS", color: "text-neon-purple", suffix: "" },
                { value: 360, label: "TOTAL POINTS", color: "text-gold-400", suffix: "" },
                { value: 100, label: "COMPLETION", color: "text-neon-lime", suffix: "%" },
              ].map((stat) => (
                <div key={stat.label} className="stat-card">
                  <p className={`text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter ${stat.color}`}>
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-3 text-[11px] font-bold tracking-[0.25em] text-white/30 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — 3 STEPS
          ═══════════════════════════════════════ */}
      <section className="relative py-32">
        <div className="orb orb-gold absolute right-0 top-[20%] h-[400px] w-[400px]" />

        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <span className="tag-gold mb-6 inline-block">The Process</span>
            <h2 className="mb-20 text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
              THREE STEPS.
              <br />
              <span className="text-white/15">ZERO EXCUSES.</span>
            </h2>
          </Reveal>

          <div className="space-y-0">
            {[
              {
                num: "01",
                title: "IMPLEMENT",
                desc: "Each week has specific tasks. Take action on your business. No theory — only execution.",
                color: "text-neon-cyan",
                border: "border-neon-cyan/10 hover:border-neon-cyan/30",
                glow: "group-hover:shadow-[0_0_60px_rgba(0,240,255,0.06)]",
              },
              {
                num: "02",
                title: "PROVE IT",
                desc: "Upload screenshots, documents, or recordings. Show the work. Evidence over words.",
                color: "text-neon-purple",
                border: "border-neon-purple/10 hover:border-neon-purple/30",
                glow: "group-hover:shadow-[0_0_60px_rgba(191,90,242,0.06)]",
              },
              {
                num: "03",
                title: "DOMINATE",
                desc: "Earn points. Climb the leaderboard. Compete with fellow entrepreneurs for the top spot.",
                color: "text-gold-400",
                border: "border-gold-400/10 hover:border-gold-400/30",
                glow: "group-hover:shadow-[0_0_60px_rgba(255,186,0,0.06)]",
              },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 0.1}>
                <div className={`group flex items-start gap-6 border-t ${step.border} py-12 transition-all duration-500 sm:gap-12 ${step.glow}`}>
                  <span className={`text-6xl font-black leading-none ${step.color} opacity-20 transition-opacity duration-500 group-hover:opacity-60 sm:text-8xl`}>
                    {step.num}
                  </span>
                  <div className="flex-1">
                    <h3 className={`mb-3 text-3xl font-black tracking-tight text-white transition-colors duration-500 group-hover:${step.color} sm:text-5xl`}>
                      {step.title}
                    </h3>
                    <p className="max-w-md text-base text-white/40 sm:text-lg">
                      {step.desc}
                    </p>
                  </div>
                  <div className="hidden self-center sm:block">
                    <svg className={`h-8 w-8 text-white/10 transition-all duration-500 group-hover:${step.color} group-hover:translate-x-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          12-WEEK ROADMAP
          ═══════════════════════════════════════ */}
      <section className="section-elevated relative py-32">
        <div className="orb orb-purple absolute left-[5%] top-[20%] h-[500px] w-[500px]" />

        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <span className="tag-cyan mb-6 inline-block">The Roadmap</span>
            <h2 className="mb-4 text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
              12 WEEKS.
            </h2>
            <p className="mb-16 text-xl text-white/30">
              Every session takes you closer to mastery.
            </p>
          </Reveal>
        </div>

        {/* Horizontal scrollable cards */}
        <div className="hide-scrollbar overflow-x-auto pb-6">
          <div className="flex gap-5 px-4 sm:px-8" style={{ width: "max-content" }}>
            {weeksData.map((week, i) => (
              <Reveal key={week.week} delay={i * 0.03}>
                <motion.div
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="card group relative w-[300px] p-6 sm:w-[340px]"
                >
                  {/* Background week number */}
                  <span className="pointer-events-none absolute -right-3 -top-4 text-[90px] font-black leading-none text-white/[0.03] transition-all duration-500 group-hover:text-neon-cyan/[0.06]">
                    {String(week.week).padStart(2, "0")}
                  </span>

                  <div className="relative">
                    {/* Top row */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.06] text-sm font-black text-neon-cyan">
                        {String(week.week).padStart(2, "0")}
                      </div>
                      <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        week.sessionType === "Group Session"
                          ? "bg-neon-cyan/[0.06] text-neon-cyan/70 border border-neon-cyan/10"
                          : "bg-neon-purple/[0.06] text-neon-purple/70 border border-neon-purple/10"
                      }`}>
                        {week.sessionType === "Group Session" ? "Group" : "1-on-1"}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-neon-cyan">
                      {week.sessionName}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-white/30">{week.focusArea}</p>

                    <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
                      <span className="text-sm font-bold text-gold-400">{week.maxPoints} pts</span>
                      <span className="text-xs font-medium text-white/20">{week.tasks.length} tasks</span>
                    </div>
                  </div>

                  {/* Bottom glow line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-transparent transition-all duration-500 group-hover:w-full" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — GOLD ACCENT
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-40">
        <div className="orb orb-gold absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2" />
        <div className="divider-gold absolute top-0 left-0 right-0" />

        <Reveal className="relative z-10 text-center px-4">
          <h2 className="mb-4 text-6xl font-black tracking-tight text-white sm:text-8xl lg:text-9xl">
            READY<span className="text-gold-400">?</span>
          </h2>
          <p className="mx-auto mb-12 max-w-md text-lg text-white/30">
            Join the mentorship program and prove what you&apos;re made of.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/signup">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-3 px-12 py-5 text-sm tracking-[0.15em] uppercase"
              >
                Join Now
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.span>
            </Link>
            <Link href="/dashboard">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary inline-flex items-center gap-3 px-12 py-5 text-sm tracking-[0.15em] uppercase"
              >
                Go to Dashboard
              </motion.span>
            </Link>
          </div>
        </Reveal>

        <div className="divider-gold absolute bottom-0 left-0 right-0" />
      </section>
    </div>
  );
}
