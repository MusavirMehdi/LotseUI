import React from 'react';
import { Compass, ShieldCheck, GraduationCap, Briefcase, Wrench, Sparkles } from 'lucide-react';

export const ThreeTrackOptions: React.FC = () => {
  return (
    <section
      id="tracks"
      aria-label="Three Track Options"
      className="max-w-5xl mx-auto my-12 px-4 sm:px-6"
    >
      <div className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-7 shadow-xl shadow-black/5 dark:shadow-black/25 text-left">
        {/* Header Bar of Three Track Options Board */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Three Track Options
              </h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-0.5">
                Deterministic Eligibility &amp; Official Recognition Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Hallucinations</span>
            </div>
          </div>
        </div>

        {/* Three Guided Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {/* Track 1: Higher Education */}
          <div className="group p-4 rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-zinc-950/40 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <GraduationCap className="w-4 h-4" />
              </span>
              <span className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">Track 01</span>
            </div>
            <h3 className="font-sans text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
              Study in Germany
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
              Bachelors &amp; Masters programmes with Anabin degree compatibility and university admission qualification.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-blue-600 dark:text-blue-400 pt-2 border-t border-black/5 dark:border-white/5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>APS &amp; ECTS Matching</span>
            </div>
          </div>

          {/* Track 2: Ausbildung */}
          <div className="group p-4 rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-zinc-950/40 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Wrench className="w-4 h-4" />
              </span>
              <span className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">Track 02</span>
            </div>
            <h3 className="font-sans text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
              Ausbildung (Vocational)
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
              Dual vocational training with monthly stipend across healthcare, tech, logistics, and skilled trades.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 pt-2 border-t border-black/5 dark:border-white/5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>B1/B2 German Pathway</span>
            </div>
          </div>

          {/* Track 3: Direct Career Transition */}
          <div className="group p-4 rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-zinc-950/40 hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Briefcase className="w-4 h-4" />
              </span>
              <span className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">Track 03</span>
            </div>
            <h3 className="font-sans text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
              Skilled Employment
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
              Chancenkarte (Opportunity Card) points scoring, qualification recognition &amp; direct employer matching.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-400 pt-2 border-t border-black/5 dark:border-white/5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Defizitbescheid Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
