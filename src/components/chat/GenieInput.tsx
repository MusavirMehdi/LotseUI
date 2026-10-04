import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';

export interface GenieInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const GenieInput: React.FC<GenieInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = 'Ask LOTSE GENIE about studying, Ausbildung, or work...',
  className = '',
}) => {
  const [value, setValue] = useState('');

  const trimmed = value.trim();
  const canSubmit = !disabled && trimmed.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (canSubmit) {
        onSubmit(trimmed);
        setValue('');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center gap-2 p-2.5 sm:p-3 border-t border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-zinc-950/60 backdrop-blur-sm shrink-0 ${className}`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="Message LOTSE GENIE"
        className="flex-1 min-w-0 px-3.5 py-2 text-xs sm:text-sm bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 rounded-xl border border-black/10 dark:border-white/10 focus:outline-none focus:border-blue-500/60 dark:focus:border-blue-400/60 focus:ring-1 focus:ring-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-text"
      />
      <button
        type="submit"
        disabled={!canSubmit}
        aria-label="Send message"
        className="p-2 sm:p-2.5 rounded-xl bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:active:scale-100 transition-all shadow-xs flex items-center justify-center shrink-0"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </form>
  );
};
