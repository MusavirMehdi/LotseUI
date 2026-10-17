import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Building2,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { GenieHeader } from './GenieHeader';

export interface ContinueChatCardProps {
  className?: string;
}

export const ContinueChatCard: React.FC<ContinueChatCardProps> = ({ className = '' }) => {
  const {
    activePathway,
    conversationState,
    pendingQuestion,
    isAgentRunning,
    currentAgentReason,
    messages,
  } = useChat();

  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/chat');
  };

  const pathwayConfig = {
    study: {
      label: 'Higher Education (Study)',
      badge: 'Study Track',
      icon: GraduationCap,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10 dark:bg-blue-500/15',
      border: 'border-blue-500/20',
    },
    training: {
      label: 'Vocational Training (Ausbildung)',
      badge: 'Ausbildung Track',
      icon: Briefcase,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
      border: 'border-indigo-500/20',
    },
    work: {
      label: 'Skilled Employment (Work)',
      badge: 'Work Track',
      icon: Building2,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-500/10 dark:bg-sky-500/15',
      border: 'border-sky-500/20',
    },
  }[activePathway || 'study'];

  const PathwayIcon = pathwayConfig.icon;

  // Status badge config
  const statusConfig = isAgentRunning || conversationState === 'running'
    ? {
        label: 'Evaluating Next Steps',
        color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
        pulse: true,
      }
    : conversationState === 'waiting_for_applicant' || pendingQuestion
      ? {
          label: 'Awaiting Your Response',
          color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
          pulse: false,
        }
      : {
          label: 'Conversation Ready',
          color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          pulse: false,
        };

  // Find the last relevant message text or prompt
  const lastGenieMessage = [...messages].reverse().find((m) => m.sender === 'genie');
  const previewText = pendingQuestion
    ? pendingQuestion.prompt
    : lastGenieMessage
      ? lastGenieMessage.text
      : 'Your conversation is active. Click continue to resume discussing your options in Germany.';

  return (
    <div
      className={`w-full h-full flex flex-col bg-[var(--surface-card)] text-[var(--text-primary)] select-none overflow-y-auto ${className}`}
    >
      {/* 1. Header with Active Status */}
      <GenieHeader mode="mini" statusText={statusConfig.label} />

      {/* 2. Interactive Returning User Workspace */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 max-w-2xl mx-auto w-full text-center">
        {/* Pathway Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border mb-4 shadow-2xs transition-all bg-[var(--surface-elevated)] border-[var(--border-subtle)]">
          <span className={`w-2 h-2 rounded-full ${statusConfig.pulse ? 'bg-blue-500 animate-ping' : 'bg-emerald-500'}`} />
          <span className="text-zinc-600 dark:text-zinc-300">Active Pathway:</span>
          <span className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
            <PathwayIcon className="w-3.5 h-3.5 text-blue-500" />
            {pathwayConfig.badge}
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white mb-2">
          Resume your consultation
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
          LOTSE GENIE is ready to continue your guided evaluation for opportunities in Germany.
        </p>

        {/* Conversation Context Box */}
        <div className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 sm:p-5 text-left mb-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <MessageSquare className="w-4 h-4" />
              <span>
                {pendingQuestion ? 'Pending Question' : 'Latest Discussion'}
              </span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 line-clamp-3 leading-relaxed">
            {previewText}
          </p>

          {isAgentRunning && currentAgentReason && (
            <div className="mt-2.5 pt-2.5 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <span className="truncate">{currentAgentReason}</span>
            </div>
          )}
        </div>

        {/* Action Button: Continue Chat */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            data-cursor="hover"
            onClick={handleContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <span>Continue conversation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Security guarantee line */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-zinc-400 dark:text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>All decisions and evaluation rules remain verified and deterministic.</span>
        </div>
      </div>
    </div>
  );
};
