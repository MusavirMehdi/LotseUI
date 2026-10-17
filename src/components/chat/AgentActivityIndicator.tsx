import React from 'react';
import { Loader2, Square } from 'lucide-react';

export interface AgentActivityIndicatorProps {
  isRunning: boolean;
  currentReason?: string;
  iteration?: number;
  toolName?: string;
  onStop?: () => void;
}

export const AgentActivityIndicator: React.FC<AgentActivityIndicatorProps> = ({
  isRunning,
  currentReason = 'Analyzing requirements and state...',
  iteration,
  toolName,
  onStop,
}) => {
  if (!isRunning) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 my-2 rounded-2xl bg-blue-500/10 dark:bg-blue-950/40 border border-blue-500/20 text-xs animate-in fade-in">
      <div className="flex items-center gap-2.5 min-w-0">
        <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
        <div className="truncate">
          <span className="font-semibold text-blue-700 dark:text-blue-300">
            {toolName ? `Running ${toolName}` : 'LOTSE Agent'}:
          </span>{' '}
          <span className="text-zinc-700 dark:text-zinc-300">{currentReason}</span>
          {iteration !== undefined && iteration > 0 && (
            <span className="ml-1.5 text-[11px] text-zinc-400 font-mono">
              (step {iteration})
            </span>
          )}
        </div>
      </div>

      {onStop && (
        <button
          type="button"
          onClick={onStop}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-400 border border-black/10 dark:border-white/10 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 transition-colors shrink-0 cursor-pointer"
        >
          <Square className="w-3 h-3 fill-current" />
          <span>Stop</span>
        </button>
      )}
    </div>
  );
};
