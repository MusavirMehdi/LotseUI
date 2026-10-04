import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { AnimatedBackground } from '../components/layout/AnimatedBackground';
import { Hero } from '../components/sections/Hero';
import { ScreenFrame } from '../components/chat/ScreenFrame';
import { GenieShowcase } from '../components/chat/GenieShowcase';
import { ThreeTrackOptions } from '../components/sections/ThreeTrackOptions';
import { Features } from '../components/sections/Features';
import { Architecture } from '../components/sections/Architecture';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-transparent text-[var(--text-primary)] transition-colors duration-200 selection:bg-blue-500 selection:text-white">
      {/* Fixed Ambient Background with Drifting Color-Cycling Blobs & Base Color */}
      <AnimatedBackground />

      {/* Page Content wrapped in relative z-10 to stay above ambient drifting blobs */}
      <div className="relative z-10 bg-transparent">
        {/* Full-width Edge-to-Edge Navbar */}
        <Navbar />

        {/* Main Page Content Flow */}
        <main className="bg-transparent">
          {/* 1. Hero Text & CTAs */}
          <Hero />

          {/* 2. Showcase Window (#showcase) - ScreenFrame peeks into 1440x900 viewport */}
          <section
            id="showcase"
            aria-label="LOTSE GENIE Showcase"
            className="w-full mx-auto my-0 px-2 sm:px-6 lg:px-8 text-center bg-transparent scroll-mt-20"
          >
            {/* Mini Computer Screen Frame with Animated Light-Blue Border */}
            <ScreenFrame>
              <GenieShowcase />
            </ScreenFrame>

            {/* Heading & Subtext placed below monitor base, before Three Track Options */}
            <div className="max-w-2xl mx-auto mt-12 sm:mt-16 mb-4 text-center px-4">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white mb-3">
                Meet your guide to Germany.
              </h2>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
                Tell LOTSE where you want to go. It helps you understand what comes next.
              </p>
            </div>
          </section>

          {/* 3. Three Track Options Board */}
          <ThreeTrackOptions />

          {/* 4. Platform Features (#features) */}
          <Features />

          {/* 5. System Architecture (#architecture) */}
          <Architecture />

          {/* 6. Placeholder: Team (#team) - Stage 5 */}
          <section
            id="team"
            aria-label="The Team"
            className="min-h-[340px] max-w-5xl mx-auto my-16 px-4 sm:px-6 flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-black/15 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-8"
          >
            <div className="max-w-md">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                #team — Stage 5
              </span>
              <h2 className="text-2xl font-semibold mt-2 mb-2 text-zinc-900 dark:text-zinc-100">
                The People Behind LOTSE
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Placeholder team members, credentials, and institutional foundation with Educaro.
              </p>
            </div>
          </section>

          {/* 7. Placeholder: Testimonials (#testimonials) - Stage 5 */}
          <section
            id="testimonials"
            aria-label="Candidate Testimonials"
            className="min-h-[340px] max-w-5xl mx-auto my-16 px-4 sm:px-6 flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-black/15 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-8"
          >
            <div className="max-w-md">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                #testimonials — Stage 5
              </span>
              <h2 className="text-2xl font-semibold mt-2 mb-2 text-zinc-900 dark:text-zinc-100">
                Applicant Stories &amp; Demo Reviews
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Clearly marked demo testimonials highlighting structured guidance and visa pathway transparency.
              </p>
            </div>
          </section>

          {/* 8. Placeholder: FAQs (#faqs) - Stage 5 */}
          <section
            id="faqs"
            aria-label="Frequently Asked Questions"
            className="min-h-[380px] max-w-5xl mx-auto my-16 px-4 sm:px-6 flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-black/15 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-8"
          >
            <div className="max-w-md">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                #faqs — Stage 5
              </span>
              <h2 className="text-2xl font-semibold mt-2 mb-2 text-zinc-900 dark:text-zinc-100">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Accessible accordion addressing applicant eligibility, documents, data privacy, and deterministic guidance.
              </p>
            </div>
          </section>
        </main>

        {/* 9. Minimal Footer */}
        <footer className="py-12 border-t border-black/10 dark:border-white/10 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-transparent">
          <p>© {new Date().getFullYear()} LOTSE. Guided pathways to Germany in partnership with Educaro.</p>
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
            Disclaimer: LOTSE provides deterministic guidance and document verification. Admission and employment are subject to official German authority decisions.
          </p>
        </footer>
      </div>
    </div>
  );
};
