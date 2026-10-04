import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

interface ScreenFrameProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * ScreenFrame
 * Wide, hardware computer monitor showcase wrapper (max-w-6xl to max-w-7xl):
 * - Bezel with rounded corners, top bar with 3 dots & LOTSE GENIE badge
 * - Continuously sliding light-blue border via conic-gradient (@property --border-angle)
 * - Rises on page load (translateY: 40px -> 0, 0.9s duration, opacity: 0 -> 1)
 * - Subtle scroll-linked scale (0.97 -> 1.0)
 * - Monitor stand & base plate at bottom (below the fold)
 * - Respects prefers-reduced-motion
 * - Carries data-cursor="hover" for custom pointer expansion
 */
export const ScreenFrame: React.FC<ScreenFrameProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Subtle scroll-linked scale from 0.97 to 1 as it scrolls into full view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  return (
    <motion.div
      ref={containerRef}
      data-cursor="hover"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      style={{ scale: shouldReduceMotion ? 1 : scale }}
      className={`relative w-full max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center px-2 sm:px-4 ${className}`}
    >
      {/* Outer Monitor Housing with Animated Light Border */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl p-[2px] transition-all duration-300">
        {/* Animated Light Border Glow Layer */}
        <div
          aria-hidden="true"
          className="screen-border-glow absolute -inset-[2px] rounded-2xl sm:rounded-3xl pointer-events-none opacity-40 dark:opacity-35"
        />

        {/* Animated Border Track */}
        <div
          aria-hidden="true"
          className="screen-border-animated absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
        />

        {/* Monitor Bezel & Inner Screen */}
        <div className="relative z-10 w-full rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-2px)] bg-zinc-900 dark:bg-[#0c0c0e] border border-black/20 dark:border-white/10 shadow-2xl shadow-black/30 overflow-hidden flex flex-col">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-zinc-800/80 dark:bg-zinc-900/80 border-b border-black/10 dark:border-white/10 backdrop-blur-md">
            {/* Window Dots */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 border border-rose-600/30" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 border border-amber-600/30" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 border border-emerald-600/30" />
            </div>

            {/* Center Identifier Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/25 dark:bg-white/5 border border-white/5 text-[11px] font-mono tracking-wider text-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-semibold">LOTSE GENIE</span>
            </div>

            {/* Version / Status Metadata */}
            <div className="w-14 flex justify-end">
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">v0.1</span>
            </div>
          </div>

          {/* Screen Display Canvas */}
          <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-6 sm:p-10">
            {children ? (
              children
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-white/5 bg-white/[0.02] max-w-md">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3.5 border border-blue-500/20">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                  </span>
                </div>
                <p className="text-sm sm:text-base font-medium text-zinc-200">
                  LOTSE GENIE loads here (Stage 4)
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
                  Interactive pathway chat gateway with eligibility verification
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monitor Stand / Base (Sits below the initial fold) */}
      <div aria-hidden="true" className="flex flex-col items-center -mt-[1px]">
        {/* Stand Neck */}
        <div className="w-16 sm:w-20 h-4 sm:h-5 bg-gradient-to-b from-zinc-700 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border-x border-zinc-600/30 dark:border-zinc-700/40 shadow-inner" />

        {/* Stand Foot / Base Plate */}
        <div className="w-48 sm:w-64 h-2.5 sm:h-3 rounded-full bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 dark:from-zinc-800 dark:via-zinc-600 dark:to-zinc-800 shadow-lg shadow-black/30 border-t border-zinc-500/30 dark:border-zinc-500/20" />

        {/* Ambient Desk Drop Shadow */}
        <div className="w-64 sm:w-80 h-3.5 bg-black/20 dark:bg-black/50 blur-md rounded-full -mt-0.5" />
      </div>
    </motion.div>
  );
};
