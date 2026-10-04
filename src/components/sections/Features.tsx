import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface FeatureCardProps {
  title: string;
  description: string;
  badge?: string;
  className?: string;
  icon: React.ReactNode;
  visual: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  badge,
  className = '',
  icon,
  visual,
}) => {
  return (
    <div
      data-cursor="hover"
      className={`group relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]/80 dark:bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-xs hover:border-blue-500/40 dark:hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200">
            {icon}
          </div>
          {badge && (
            <span className="font-mono text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-zinc-500 dark:text-zinc-400">
              {badge}
            </span>
          )}
        </div>

        <h3 className="font-sans text-base sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Decorative Visual Area */}
      <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
        {visual}
      </div>
    </div>
  );
};

export const Features: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="features"
      aria-label="Platform Features"
      className="max-w-6xl xl:max-w-7xl mx-auto my-24 sm:my-32 px-4 sm:px-6 lg:px-8 scroll-mt-24"
    >
      {/* Section Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="max-w-3xl mx-auto text-center mb-14 sm:mb-18"
      >
        {/* Eyebrow badge */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="font-mono text-[11px] font-semibold tracking-widest uppercase text-zinc-700 dark:text-zinc-300">
              PLATFORM CAPABILITIES
            </span>
          </div>
        </motion.div>

        {/* Heading: Sans + Italic Serif */}
        <motion.h2
          variants={itemVariants}
          className="font-sans text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-white leading-[1.12]"
        >
          Everything you need.{' '}
          <span className="font-serif italic font-normal text-blue-600 dark:text-blue-400 block sm:inline">
            One guided journey.
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto"
        >
          From your first exploratory question to official recognition and visa-ready documentation, LOTSE structures every step of your German pathway.
        </motion.p>
      </motion.div>

      {/* Asymmetric Bento Composition Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        {/* Card 1: AI Conversation (Featured Large Card, spans 2 cols on lg) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <FeatureCard
            title="AI Conversation"
            description="An intelligent assistant that understands your goals, educational history and professional aspirations, guiding you smoothly through the process."
            badge="Interactive Gateway"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                <path d="M8 12h.01" />
                <path d="M12 12h.01" />
                <path d="M16 12h.01" />
              </svg>
            }
            visual={
              <div className="rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-bold">
                    G
                  </div>
                  <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    What brings you to Germany?
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                    Higher Education (Master&apos;s)
                  </span>
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-400">
                    Dual Vocational (Ausbildung)
                  </span>
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-400">
                    Skilled Employment (Blue Card)
                  </span>
                </div>
              </div>
            }
          />
        </motion.div>

        {/* Card 2: Document Intelligence */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <FeatureCard
            title="Document Intelligence"
            description="Extracts relevant information from your uploaded academic certificates, transcripts and diplomas."
            badge="Extraction"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
            }
            visual={
              <div className="rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-3 flex flex-col gap-1.5 font-mono text-[10px]">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>TRANSCRIPT_SCAN</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">PARSED</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex justify-between items-center">
                  <span>Anabin Status</span>
                  <span className="font-bold">H+ Institution</span>
                </div>
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 flex justify-between items-center">
                  <span>ECTS Compatibility</span>
                  <span className="font-bold">180 Credits</span>
                </div>
              </div>
            }
          />
        </motion.div>

        {/* Card 3: Profile Generation */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <FeatureCard
            title="Profile Generation"
            description="Turns your information into a structured, verified profile ready for institutional evaluation."
            badge="Structured"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
            visual={
              <div className="rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                    Applicant Profile Schema v1.2
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
                    B.Tech Computer Science
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
                    German Level: B2
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    APS Verification Ready
                  </span>
                </div>
              </div>
            }
          />
        </motion.div>

        {/* Card 4: AI CV Generation */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <FeatureCard
            title="AI CV Generation"
            description="Creates a German-standard tabular CV based strictly on verified applicant information."
            badge="Standards Compliant"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            }
            visual={
              <div className="rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>TABELLARISCHER LEBENSLAUF</span>
                  <span className="text-blue-600 dark:text-blue-400">PDF FORMAT</span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-3/4 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="h-1.5 w-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-1.5 w-2/3 rounded-full bg-blue-500/40" />
                </div>
              </div>
            }
          />
        </motion.div>

        {/* Card 5: Eligibility Assessment */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <FeatureCard
            title="Eligibility Assessment"
            description="Checks your qualifications against predefined eligibility criteria without hallucinations."
            badge="Deterministic"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            }
            visual={
              <div className="rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-zinc-900 dark:text-white">
                    Anabin &amp; APS Rules
                  </span>
                  <span className="text-[10px] text-zinc-500">Criteria Met: 4 of 4</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                  ELIGIBLE
                </div>
              </div>
            }
          />
        </motion.div>

        {/* Card 6: Gap Detection */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <FeatureCard
            title="Gap Detection"
            description="Identifies missing information, inconsistent data and incomplete requirements before submission."
            badge="Pre-validation"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            }
            visual={
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 p-3 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  !
                </div>
                <div className="flex flex-col text-[10px]">
                  <span className="font-semibold text-amber-800 dark:text-amber-300">
                    Actionable Gap Flagged
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Language certificate expires in 30 days
                  </span>
                </div>
              </div>
            }
          />
        </motion.div>

        {/* Card 7: Next-Step Recommendations (Wide card, spans 2 cols on lg) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <FeatureCard
            title="Next-Step Recommendations"
            description="Suggests the appropriate next step within Educaro's comprehensive services, from visa coaching to direct university placement."
            badge="Actionable Pathway"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            }
            visual={
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col">
                  <span className="text-zinc-500">Step 01</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">APS Submission</span>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 flex flex-col">
                  <span className="text-blue-500">Step 02 (Current)</span>
                  <span className="font-semibold mt-0.5">Educaro Language Track</span>
                </div>
                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col">
                  <span className="text-zinc-500">Step 03</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">Visa Appointment</span>
                </div>
              </div>
            }
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
