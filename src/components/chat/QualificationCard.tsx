import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp, Award } from 'lucide-react';

export interface QualificationCardProps {
  pathway: string;
  status: 'MET' | 'NOT_MET' | 'UNKNOWN' | 'INCOMPLETE' | string;
  reason?: string;
  results?: Array<{
    rule_id: string;
    status: string;
    reason_text?: string;
    label?: string;
  }>;
  missingFields?: string[];
}

export const QualificationCard: React.FC<QualificationCardProps> = ({
  pathway,
  status,
  reason,
  results = [],
  missingFields = [],
}) => {
  const [expanded, setExpanded] = useState(false);

  const incompleteConfig = {
    label: 'Information Incomplete',
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: <HelpCircle className="w-5 h-5 text-amber-500" />,
    subtext: 'Additional document or profile details are required to complete full evaluation.',
  };

  const statusConfig = {
    MET: {
      label: 'Requirements Met',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      subtext: 'Your evaluated profile satisfies the legal and academic criteria for this pathway.',
    },
    NOT_MET: {
      label: 'Criteria Incomplete or Not Met',
      badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: <XCircle className="w-5 h-5 text-rose-500" />,
      subtext: 'Certain requirements for this pathway are not yet satisfied.',
    },
    UNKNOWN: incompleteConfig,
    INCOMPLETE: incompleteConfig,
  }[status] || {
    label: status,
    badgeClass: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
    icon: <HelpCircle className="w-5 h-5 text-zinc-400" />,
    subtext: '',
  };

  const pathwayLabel = {
    study: 'Higher Education (Study)',
    training: 'Vocational Training (Ausbildung)',
    work: 'Skilled Employment (Work)',
  }[pathway.toLowerCase()] || pathway;

  return (
    <div className="w-full my-3 p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Deterministic Qualification Assessment
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white">
              {pathwayLabel}
            </h4>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}
        >
          {statusConfig.icon}
          <span>{statusConfig.label}</span>
        </span>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">{statusConfig.subtext}</p>
      {reason && (
        <div className="text-xs p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-700 dark:text-zinc-300 mb-3">
          <span className="font-medium text-zinc-900 dark:text-white">Analysis note: </span>
          {reason}
        </div>
      )}

      {/* Missing Fields Pill List */}
      {missingFields.length > 0 && (
        <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
          <div className="font-semibold mb-1">Missing profile information needed:</div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {missingFields.map((f, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[11px] font-mono"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Detailed Rules Breakdown */}
      {results.length > 0 && (
        <div className="border-t border-[var(--border-subtle)] pt-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Detailed Rule Evaluation ({results.length} checks)</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="mt-3 space-y-2">
              {results.map((r, i) => {
                const isMet = r.status === 'MET';
                const isNotMet = r.status === 'NOT_MET';
                return (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-white">
                        {r.label || r.rule_id}
                      </div>
                      {r.reason_text && (
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {r.reason_text}
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        isMet
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : isNotMet
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : 'bg-zinc-500/15 text-zinc-500'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
