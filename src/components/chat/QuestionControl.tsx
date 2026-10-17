import React, { useState } from 'react';
import { Check, HelpCircle, ArrowRight } from 'lucide-react';

export interface QuestionData {
  question_id: string;
  kind: string;
  prompt: string;
  options?: string[] | null;
  field_key?: string | null;
  field_label?: string | null;
  reason?: string;
  answered?: boolean;
  selectedAnswer?: string | number | boolean;
}

export interface QuestionControlProps {
  question: QuestionData;
  onAnswer: (questionId: string, value: string | number | boolean) => void;
  disabled?: boolean;
}

export const QuestionControl: React.FC<QuestionControlProps> = ({
  question,
  onAnswer,
  disabled = false,
}) => {
  const [customValue, setCustomValue] = useState('');
  const isAnswered = question.answered;

  const handleSelectOption = (opt: string) => {
    if (disabled || isAnswered) return;
    onAnswer(question.question_id, opt);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || isAnswered || !customValue.trim()) return;
    onAnswer(question.question_id, customValue.trim());
  };

  return (
    <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 flex flex-col gap-2.5">
      {/* Reason or Field Context */}
      {question.field_label && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Requirement: {question.field_label}</span>
        </div>
      )}

      {/* Selectable Options Pills */}
      {question.options && question.options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {question.options.map((option, idx) => {
            const isSelected = isAnswered && question.selectedAnswer === option;
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : isAnswered
                      ? 'opacity-40 border-black/10 dark:border-white/10 bg-transparent text-zinc-500 cursor-not-allowed'
                      : 'bg-[var(--surface-elevated)] border-[var(--border-strong)] text-zinc-800 dark:text-zinc-200 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Confirmation Kind (Yes / No) */}
      {question.kind === 'confirm' && (!question.options || question.options.length === 0) && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled || isAnswered}
            onClick={() => onAnswer(question.question_id, true)}
            className={`text-xs px-4 py-1.5 rounded-xl border font-medium cursor-pointer transition-all ${
              isAnswered && question.selectedAnswer === true
                ? 'bg-emerald-600 text-white border-emerald-600'
                : isAnswered
                  ? 'opacity-40 border-black/10 dark:border-white/10'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            Yes, confirm
          </button>
          <button
            type="button"
            disabled={disabled || isAnswered}
            onClick={() => onAnswer(question.question_id, false)}
            className={`text-xs px-4 py-1.5 rounded-xl border font-medium cursor-pointer transition-all ${
              isAnswered && question.selectedAnswer === false
                ? 'bg-rose-600 text-white border-rose-600'
                : isAnswered
                  ? 'opacity-40 border-black/10 dark:border-white/10'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
            }`}
          >
            No, change
          </button>
        </div>
      )}

      {/* Freeform Quick Input when no predefined options */}
      {(!question.options || question.options.length === 0) && question.kind !== 'confirm' && !isAnswered && (
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 mt-1">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            disabled={disabled || isAnswered}
            placeholder="Type your answer..."
            className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={disabled || isAnswered || !customValue.trim()}
            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-all cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {isAnswered && (
        <div className="text-[11px] text-zinc-400 dark:text-zinc-500 italic flex items-center gap-1">
          <Check className="w-3 h-3 text-emerald-500" />
          <span>Answer submitted</span>
        </div>
      )}
    </div>
  );
};
