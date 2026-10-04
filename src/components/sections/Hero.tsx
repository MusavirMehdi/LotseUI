import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants respecting prefers-reduced-motion
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      aria-label="Introduction to LOTSE"
      className="relative flex flex-col justify-center items-center pt-24 sm:pt-28 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto flex flex-col items-center text-center"
      >
        {/* Eyebrow Pill */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-zinc-700 dark:text-zinc-300">
              YOUR JOURNEY TO GERMANY STARTS HERE
            </span>
          </div>
        </motion.div>

        {/* Heading: High-contrast Sans + Editorial Italic Serif */}
        <motion.h1
          variants={itemVariants}
          className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-950 dark:text-white leading-[1.08] max-w-3xl mb-4 sm:mb-5"
        >
          Your future in Germany.{' '}
          <span className="font-serif italic font-normal text-blue-600 dark:text-blue-400 block sm:inline">
            One guided pathway.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mb-7 sm:mb-8"
        >
          Navigate education, training and career opportunities in Germany with an AI assistant that
          understands your profile, checks your eligibility and helps you take the right next step.
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          {/* Primary CTA: scrolls to #showcase */}
          <a
            href="#showcase"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-medium text-sm sm:text-base shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-100 hover:shadow-lg transition-all duration-200 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Start your journey</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          {/* Secondary CTA: scrolls to #features */}
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 font-medium text-sm sm:text-base backdrop-blur-sm transition-all duration-200 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Explore how it works</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
