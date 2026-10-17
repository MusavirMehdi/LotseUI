import React, { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';

export interface ConflictResolutionCardProps {
  conflictId: string;
  fieldKey: string;
  fieldLabel: string;
  oldValue: any;
  newValue: any;
  reason?: string;
  resolved?: boolean;
  chosen?: 'old' | 'new';
  onResolve: (conflictId: string, choose: 'old' | 'new') => Promise<void>;
}

export const ConflictResolutionCard: React.FC<ConflictResolutionCardProps> = ({
  conflictId,
  fieldKey,
  fieldLabel,
  oldValue,
  newValue,
  reason,
  resolved = false,
  chosen,
  onResolve,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentChosen, setCurrentChosen] = useState<'old' | 'new' | undefined>(chosen);

  const handleChoose = async (choice: 'old' | 'new') => {
    if (resolved || loading || currentChosen) return;
    setLoading(true);
    try {
      await onResolve(conflictId, choice);
      setCurrentChosen(choice);
    } finally {
      setLoading(false);
    }
  };

  const isResolved = resolved || !!currentChosen;

  return (
    <div className="w-full my-3 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300">
            Data Conflict Detected: {fieldLabel || fieldKey}
          </h4>
          {reason && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{reason}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-3">
        A discrepancy was found between your previously recorded profile information and a recently provided document or answer. Please confirm which value is authoritative:
      </p>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Existing Value Card */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            currentChosen === 'old'
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-black/10 dark:border-white/10 bg-[var(--surface-card)]'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Existing Verified Record
          </div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">
            {String(oldValue)}
          </div>
          {!isResolved ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleChoose('old')}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-medium border border-[var(--border-strong)] bg-[var(--surface-elevated)] hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Keep This Value
            </button>
          ) : currentChosen === 'old' ? (
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Selected
            </div>
          ) : null}
        </div>

        {/* Incoming Value Card */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            currentChosen === 'new'
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-black/10 dark:border-white/10 bg-[var(--surface-card)]'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400 mb-1">
            New / Incoming Value
          </div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">
            {String(newValue)}
          </div>
          {!isResolved ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleChoose('new')}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              Use New Value
            </button>
          ) : currentChosen === 'new' ? (
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Selected
            </div>
          ) : null}
        </div>
      </div>

      {isResolved && (
        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          <span>Conflict resolved and updated in profile records.</span>
        </div>
      )}
    </div>
  );
};
