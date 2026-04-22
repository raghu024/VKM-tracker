import { motion } from 'framer-motion';

export default function ProgressRing({ progress = 0, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="50%" stopColor="#D4A853" />
            <stop offset="100%" stopColor="#F5DEB3" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          strokeWidth={strokeWidth}
          stroke="rgba(31, 41, 55, 0.8)"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated progress arc */}
        <motion.circle
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          stroke="url(#ring-gradient)"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
        />
      </svg>
      {/* Center percentage */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-2xl font-bold font-mono text-text-primary"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {Math.round(progress)}%
        </motion.span>
        <span className="text-[10px] text-text-secondary font-medium mt-0.5">Complete</span>
      </div>
    </div>
  );
}
