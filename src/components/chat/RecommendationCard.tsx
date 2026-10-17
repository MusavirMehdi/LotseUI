import React, { useState } from 'react';
import { Compass, ExternalLink, CheckCircle2, BookOpen, Clock, Landmark, ChevronDown } from 'lucide-react';

export interface RecommendationCardProps {
  pathway?: string;
  action: string;
  steps?: Array<{
    label: string;
    educaro_service?: any;
  }>;
  reason?: string;
}

interface KnowledgeGuide {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  linkText?: string;
  linkUrl?: string;
}

const STAGE2_KNOWLEDGE_GUIDES: Record<string, KnowledgeGuide[]> = {
  study: [
    {
      id: 'uni-assist',
      title: 'Uni-Assist & DAAD Deadlines',
      icon: BookOpen,
      summary:
        'Most German universities open Winter Semester applications between May 1 and July 15. Check whether your target program requires a Vorprüfungsdokumentation (VPD) through Uni-Assist early, as VPD processing takes 4–6 weeks.',
      linkText: 'Uni-Assist Checklist',
      linkUrl: 'https://www.uni-assist.de/en/how-to-apply/',
    },
    {
      id: 'visa-timeline',
      title: 'Student Visa Timeline',
      icon: Clock,
      summary:
        'National Visa (Category D) processing takes 4 to 8 weeks after the VFS/Embassy appointment. You must have your APS certificate, admission letter, and blocked account confirmation ready before your appointment date.',
      linkText: 'German Missions India Visa Info',
      linkUrl: 'https://india.diplo.de/in-en/service/-/2590212',
    },
    {
      id: 'blocked-account',
      title: 'Blocked Account (€11,904/year)',
      icon: Landmark,
      summary:
        'Proof of financial resources requires €11,904 deposited in a federally approved blocked account, allowing monthly withdrawals of €992 to cover living expenses during your studies.',
      linkText: 'Expatrio Blocked Account Guide',
      linkUrl: 'https://www.expatrio.com/',
    },
  ],
  training: [
    {
      id: 'ausbildung-contract',
      title: 'Ausbildung Contract Requirements',
      icon: BookOpen,
      summary:
        'Your training company must provide a registered Ausbildungsvertrag (training contract) and an operational training plan (Ausbildungsplan) approved by the IHK or HWK chamber.',
      linkText: 'Make It In Germany - Ausbildung',
      linkUrl: 'https://www.make-it-in-germany.com/en/study-vocational-training/training-in-germany',
    },
    {
      id: 'ausbildung-visa',
      title: 'Vocational Training Visa',
      icon: Clock,
      summary:
        'Requires B1 German proficiency, Federal Employment Agency (BA) pre-approval, and proof of accommodation and minimum monthly living allowance (approx. €900/month).',
      linkText: 'Embassy Visa Guide',
      linkUrl: 'https://india.diplo.de/',
    },
  ],
  work: [
    {
      id: 'blue-card-salary',
      title: 'EU Blue Card Salary Thresholds',
      icon: Landmark,
      summary:
        'The EU Blue Card requires a recognized university degree and a qualifying employment contract meeting annual gross salary thresholds (lower threshold for shortage professions such as IT, STEM, and Healthcare).',
      linkText: 'EU Blue Card Overview',
      linkUrl: 'https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card',
    },
    {
      id: 'fast-track-skilled',
      title: 'Fast-Track Skilled Worker Procedure',
      icon: Clock,
      summary:
        'Employers can initiate the fast-track procedure (§ 81a AufenthG) with the local immigration office in Germany to cut embassy appointment wait times to just 2–3 weeks.',
      linkText: 'Fast-Track Procedure Guide',
      linkUrl: 'https://www.make-it-in-germany.com/en/looking-for-foreign-professionals/entering/the-fast-track-procedure-for-skilled-workers',
    },
  ],
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  pathway = 'study',
  action,
  steps = [],
  reason,
}) => {
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);

  const isQualified = action.toLowerCase().includes('all requirements met');
  const normalizedPathway = pathway.toLowerCase();
  const guides = STAGE2_KNOWLEDGE_GUIDES[normalizedPathway] || STAGE2_KNOWLEDGE_GUIDES.study;

  const toggleGuide = (id: string) => {
    setActiveGuideId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={`w-full my-3 p-4 sm:p-5 rounded-2xl border transition-all shadow-xs ${
        isQualified
          ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20'
          : 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20'
      } text-zinc-900 dark:text-zinc-100`}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isQualified
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
            }`}
          >
            {isQualified ? <CheckCircle2 className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
          </div>
          <div>
            <div
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isQualified
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}
            >
              {isQualified ? 'Qualification Verified • Stage 2 Ready' : 'Official Route Recommendation'}
              {pathway ? ` • ${pathway.toUpperCase()}` : ''}
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white">
              {action}
            </h4>
          </div>
        </div>
      </div>

      {reason && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3.5 leading-relaxed">
          {reason}
        </p>
      )}

      {/* Recommended Pathway Steps */}
      {steps.length > 0 && (
        <div className="mt-3 space-y-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {isQualified ? 'Stage 2 Action Roadmap:' : 'Recommended Action Plan:'}
          </div>
          {steps.map((s, idx) => {
            const hasEducaro = s.educaro_service && s.educaro_service !== 'TBD';
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0 mt-0.5 ${
                      isQualified
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">{s.label}</div>
                    {hasEducaro && s.educaro_service.description && (
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {s.educaro_service.description}
                      </div>
                    )}
                  </div>
                </div>

                {hasEducaro && s.educaro_service.cta_url && (
                  <a
                    href={s.educaro_service.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-white font-medium transition-colors shrink-0 text-xs ${
                      isQualified
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <span>{s.educaro_service.cta_label || 'Official Resource'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Stage 2 Knowledge Guide Chips */}
      {isQualified && guides.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-[var(--border-subtle)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
            Instant Guidance & FAQ Guides:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {guides.map((g) => {
              const Icon = g.icon;
              const isActive = activeGuideId === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGuide(g.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/40'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[11px] font-semibold text-zinc-900 dark:text-white truncate">
                        {g.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 text-zinc-400 transition-transform ${
                        isActive ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    Click to view details
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Guide Drawer */}
          {activeGuideId && (() => {
            const activeGuide = guides.find((g) => g.id === activeGuideId);
            if (!activeGuide) return null;
            return (
              <div className="mt-2.5 p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-emerald-500/20 text-xs text-zinc-700 dark:text-zinc-300 space-y-2 animate-in fade-in duration-200">
                <div className="font-semibold text-zinc-900 dark:text-white flex items-center justify-between">
                  <span>{activeGuide.title}</span>
                  {activeGuide.linkUrl && (
                    <a
                      href={activeGuide.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>{activeGuide.linkText || 'Learn More'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="leading-relaxed text-[11px] text-zinc-600 dark:text-zinc-300">
                  {activeGuide.summary}
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
