import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles, Info, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { ChatMessage } from '../../context/ChatContext';
import { QuestionControl } from './QuestionControl';
import { ConflictResolutionCard } from './ConflictResolutionCard';
import { QualificationCard } from './QualificationCard';
import { RecommendationCard } from './RecommendationCard';

export interface GenieMessageProps {
  message: ChatMessage;
  isTyping?: boolean;
  onAnswer?: (questionId: string, value: string | number | boolean) => void;
  onResolveConflict?: (conflictId: string, choose: 'old' | 'new') => Promise<void>;
  onRetry?: () => void;
}

export const GenieMessage: React.FC<GenieMessageProps> = ({
  message,
  isTyping = false,
  onAnswer,
  onResolveConflict,
  onRetry,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isGenie = message.sender === 'genie';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    if (message.conflictData && onResolveConflict) {
      return (
        <ConflictResolutionCard
          conflictId={message.conflictData.conflictId}
          fieldKey={message.conflictData.fieldKey}
          fieldLabel={message.conflictData.fieldLabel}
          oldValue={message.conflictData.oldValue}
          newValue={message.conflictData.newValue}
          reason={message.conflictData.reason}
          resolved={message.conflictData.resolved}
          chosen={message.conflictData.chosen}
          onResolve={onResolveConflict}
        />
      );
    }

    if (message.fieldSavedData) {
      const isVerified = message.fieldSavedData.status === 'VERIFIED';
      return (
        <div className="flex items-center justify-center my-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium ${
              isVerified
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${isVerified ? 'text-emerald-500' : 'text-blue-500'}`}
            />
            <span>
              {isVerified ? 'Verified' : 'Saved'} {message.fieldSavedData.field_label}:{' '}
              <strong>{String(message.fieldSavedData.value)}</strong>
            </span>
          </div>
        </div>
      );
    }

    const isError = !!message.errorData || message.text.startsWith('Error:');
    if (isError) {
      const isRetryable = message.errorData?.retryable !== false;
      const errorMsg = message.errorData?.message || message.text.replace(/^Error:\s*/, '');

      return (
        <div className="flex flex-col items-center justify-center my-3 px-4 w-full">
          <div className="w-full max-w-lg rounded-2xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 p-4 text-center shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs sm:text-sm font-semibold text-rose-900 dark:text-rose-200 leading-snug">
                  {errorMsg}
                </p>
                <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {isRetryable
                    ? 'The assistant service encountered a temporary connection issue. Your progress is saved.'
                    : 'Please review your input or restart the conversation.'}
                </p>
              </div>
            </div>
            {isRetryable && onRetry && (
              <div className="mt-3 pt-2.5 border-t border-rose-500/15 flex justify-end">
                <button
                  type="button"
                  data-action="retry-turn"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try again</span>
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center my-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-[11px] text-zinc-600 dark:text-zinc-400">
          <Info className="w-3.5 h-3.5" />
          <span>{message.text}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.25,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className={`flex items-start gap-2.5 w-full ${isGenie ? 'justify-start' : 'justify-end'}`}
    >
      {/* Genie Avatar on Left */}
      {isGenie && (
        <div
          aria-hidden="true"
          className="w-6 h-6 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Bubble Content */}
      <div className={`relative max-w-[88%] sm:max-w-[80%] ${isGenie ? '' : 'text-right'}`}>
        {isTyping ? (
          /* Typing indicator */
          <div
            role="status"
            aria-label="LOTSE GENIE is typing"
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-100 dark:bg-zinc-800/90 border border-black/5 dark:border-white/10 shadow-xs"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-400 ${
                shouldReduceMotion ? '' : 'animate-bounce [animation-delay:-0.3s]'
              }`}
            />
            <span
              className={`w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-400 ${
                shouldReduceMotion ? '' : 'animate-bounce [animation-delay:-0.15s]'
              }`}
            />
            <span
              className={`w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-400 ${
                shouldReduceMotion ? '' : 'animate-bounce'
              }`}
            />
            <span className="sr-only">Typing...</span>
          </div>
        ) : isGenie ? (
          /* Genie Message Bubble */
          <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-black/5 dark:border-white/10 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs text-left">
            <div>{message.text}</div>

            {/* Embedded Question Controls */}
            {message.questionData && onAnswer && (
              <QuestionControl
                question={message.questionData}
                onAnswer={onAnswer}
              />
            )}

            {/* Embedded Qualification Card */}
            {message.qualificationData && (
              <QualificationCard
                pathway={message.qualificationData.pathway}
                status={message.qualificationData.status}
                reason={message.qualificationData.reason}
                results={message.qualificationData.results}
                missingFields={message.qualificationData.missingFields}
              />
            )}

            {/* Embedded Route Recommendation Card */}
            {message.recommendationData && (
              <RecommendationCard
                pathway={message.recommendationData.pathway}
                action={message.recommendationData.action}
                steps={message.recommendationData.steps}
                reason={message.recommendationData.reason}
              />
            )}
          </div>
        ) : (
          /* User Message Bubble */
          <div className="inline-block text-left rounded-2xl rounded-tr-sm px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-xs">
            {message.text}
          </div>
        )}
      </div>
    </motion.div>
  );
};
