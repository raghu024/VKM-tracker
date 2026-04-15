"use client";

import Link from "next/link";
import { weeksData } from "@/lib/weeks-data";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ── Animated Counter ── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Section Reveal Wrapper ── */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div>
      {/* ═══════════════════════════════════════
          HERO — FULL SCREEN, NIKE STYLE
          ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Animated background orbs */}
        <div className="orb orb-gold absolute -top-32 left-[10%] h-[600px] w-[600px]" />
        <div className="orb orb-purple absolute bottom-0 right-[5%] h-[500px] w-[500px]" style={{ animationDelay: "5s" }} />

        {/* Rotating decorative rings */}
        <div className="animate-rotate-slow pointer-events-none absolute h-[700px] w-[700px] rounded-full border border-white/[0.03] sm:h-[900px] sm:w-[900px]" />
        <div className="animate-rotate-slow pointer-events-none absolute h-[500px] w-[500px] rounded-full border border-gold-400/[0.06] sm:h-[700px] sm:w-[700px]" style={{ animationDirection: "reverse", animationDuration: "40s" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-6xl px-4 text-center">
          {/* Small tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.25em] text-white/50 uppercase">
                12-Week Program
              </span>
            </span>
          </motion.div>

          {/* GIANT HEADLINE */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,12vw,10rem)] font-black leading-[0.9] tracking-tighter text-white"
            >
              TRANSFORM
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-gradient-gold text-[clamp(3rem,12vw,10rem)] font-black leading-[0.9] tracking-tighter"
            >
              YOUR BUSINESS
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mx-auto mt-8 max-w-md text-base text-white/35 sm:text-lg"
          >
            Complete tasks. Upload proof. Earn points.<br />
            Dominate the leaderboard.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/auth/signup">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-3 px-10 py-5 text-sm tracking-[0.15em] uppercase"
              >
                Get Started
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </motion.span>
            </Link>
            <Link href="/leaderboard">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-ghost inline-flex items-center gap-3 px-10 py-5 text-sm tracking-[0.15em] uppercase"
              >
                Leaderboard
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
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] font-medium tracking-[0.3em] text-white/20 uppercase">Scroll</span>
            <div className="h-10 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          MARQUEE TICKER
          ═══════════════════════════════════════ */}
      <div className="overflow-hidden border-y border-white/[0.06] py-5">
        <div className="marquee">
          <div className="marquee-content">
            {Array(3).fill(null).map((_, rep) => (
              <div key={rep} className="flex items-center gap-12 px-6">
                {["LIFESTYLE", "GOALS", "STRATEGY", "MARKETING", "SALES", "CULTURE", "GROWTH", "LEADERSHIP"].map((word) => (
                  <span key={`${rep}-${word}`} className="whitespace-nowrap text-sm font-bold tracking-[0.3em] text-white/10 uppercase">
                    {word}
                    <span className="mx-6 inline-block h-1.5 w-1.5 rounded-full bg-gold-400/30" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          STATS — FULL WIDTH, GIANT NUMBERS
          ═══════════════════════════════════════ */}
      <section className="py-32">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="grid grid-cols-3 gap-8">
              {[
                { value: 12, suffix: "", label: "WEEKS" },
                { value: 36, suffix: "", label: "TASKS" },
                { value: 360, suffix: "", label: "TOTAL POINTS" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-[clamp(3rem,8vw,8rem)] font-black leading-none tracking-tighter text-white">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-3 text-[11px] font-semibold tracking-[0.3em] text-white/25 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — CINEMATIC REVEAL
          ═══════════════════════════════════════ */}
      <section className="relative py-32">
        <div className="orb orb-gold absolute right-0 top-0 h-[500px] w-[500px]" />

        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <p className="mb-4 text-[11px] font-semibold tracking-[0.3em] text-gold-400/50 uppercase">
              The Process
            </p>
            <h2 className="mb-20 text-5xl font-black tracking-tight text-white sm:text-7xl">
              THREE STEPS.<br />
              <span className="text-white/20">ZERO EXCUSES.</span>
            </h2>
          </Reveal>

          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "IMPLEMENT",
                desc: "Each week has specific tasks. Take action on your business. No theory — only execution.",
              },
              {
                num: "02",
                title: "PROVE IT",
                desc: "Upload screenshots, documents, or recordings. Show the work. Evidence over words.",
              },
              {
                num: "03",
                title: "DOMINATE",
                desc: "Earn points. Climb the leaderboard. Compete with fellow entrepreneurs for the top spot.",
              },
            ].map((step, i) => (
              <Reveal key={step.num}>
                <div className="group flex items-start gap-8 border-t border-white/[0.06] py-10 sm:gap-16">
                  <span className="text-5xl font-black text-white/[0.07] transition-colors duration-500 group-hover:text-gold-400/20 sm:text-7xl">
                    {step.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="mb-3 text-3xl font-black tracking-tight text-white transition-colors duration-500 group-hover:text-gold-400 sm:text-4xl">
                      {step.title}
                    </h3>
                    <p className="max-w-md text-base text-white/30 sm:text-lg">
                      {step.desc}
                    </p>
                  </div>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 10 }}
                    className="hidden items-center self-center sm:flex"
                  >
                    <svg className="h-8 w-8 text-white/10 transition-colors duration-500 group-hover:text-gold-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          12-WEEK ROADMAP — HORIZONTAL SCROLL
          ═══════════════════════════════════════ */}
      <section className="relative py-32">
        <div className="orb orb-purple absolute left-[10%] top-[30%] h-[500px] w-[500px]" />

        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <p className="mb-4 text-[11px] font-semibold tracking-[0.3em] text-gold-400/50 uppercase">
              The Roadmap
            </p>
            <h2 className="mb-4 text-5xl font-black tracking-tight text-white sm:text-7xl">
              12 WEEKS.
            </h2>
            <p className="mb-16 text-xl text-white/20 sm:text-2xl">
              Every session takes you closer to mastery.
            </p>
          </Reveal>
        </div>

        {/* Horizontal scrollable cards */}
        <div className="hide-scrollbar overflow-x-auto pb-4">
          <div className="flex gap-4 px-4 sm:px-8" style={{ width: "max-content" }}>
            {weeksData.map((week, i) => (
              <Reveal key={week.week} className="flex-shrink-0">
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="glass group relative w-[300px] overflow-hidden p-7 sm:w-[340px]"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  {/* Big week number */}
                  <span className="pointer-events-none absolute -right-4 -top-6 text-[100px] font-black leading-none text-white/[0.025] transition-all duration-500 group-hover:text-gold-400/[0.06]">
                    {String(week.week).padStart(2, "0")}
                  </span>

                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-400/15 bg-gold-400/[0.07] text-sm font-black text-gold-400 transition-all group-hover:border-gold-400/30 group-hover:shadow-[0_0_25px_rgba(212,160,33,0.12)]">
                        {String(week.week).padStart(2, "0")}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        week.sessionType === "Group Session"
                          ? "bg-blue-500/10 text-blue-300/60"
                          : "bg-purple-500/10 text-purple-300/60"
                      }`}>
                        {week.sessionType === "Group Session" ? "Group" : "1-on-1"}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-gold-300">
                      {week.sessionName}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-white/25">{week.focusArea}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gold-400/40">{week.maxPoints} points</span>
                      <span className="text-xs text-white/15">{week.tasks.length} tasks</span>
                    </div>
                  </div>

                  {/* Bottom glow line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-gold-400/60 to-transparent transition-all duration-500 group-hover:w-full" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — FULL BLEED
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-40">
        <div className="orb orb-gold absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2" />

        <Reveal className="relative z-10 text-center px-4">
          <h2 className="mb-6 text-5xl font-black tracking-tight text-white sm:text-7xl">
            READY?
          </h2>
          <p className="mx-auto mb-10 max-w-sm text-lg text-white/25">
            Join the mentorship program and prove what you&apos;re made of.
          </p>
          <Link href="/auth/signup">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-3 px-12 py-5 text-sm tracking-[0.15em] uppercase"
            >
              Join Now
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </motion.span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
