import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Building2,
  ArrowRight,
  Upload,
  ShieldCheck,
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { GenieHeader } from './GenieHeader';
import type { StartSessionAction } from '../../context/ChatContext';

export interface GenieStartProps {
  className?: string;
  isOverlay?: boolean;
}

export const GenieStart: React.FC<GenieStartProps> = ({
  className = '',
  isOverlay = false,
}) => {
  const { startSession, startTransition } = useChat();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const handleStart = (action: StartSessionAction) => {
    if (isOverlay) return;

    // Persist pending start action in ChatProvider & sessionStorage
    startSession(action);

    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const container = containerRef.current;

    // Mobile or reduced motion fallback: direct navigation without overlay
    if (!container || isReducedMotion || isMobile) {
      navigate('/chat');
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      navigate('/chat');
      return;
    }

    // Valid desktop expansion transition
    startTransition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      borderRadius:
        typeof window !== 'undefined'
          ? window.getComputedStyle(container).borderRadius || '16px'
          : '16px',
    });
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    handleStart({ kind: 'text', value: trimmed });
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col bg-[var(--surface-card)] text-[var(--text-primary)] select-none overflow-y-auto ${className}`}
    >
      {/* 1. Header with status text "Ready" */}
      <GenieHeader mode="mini" statusText="Ready" />

      {/* 2. Main Interactive Workspace */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10 max-w-4xl mx-auto w-full">
        {/* Main Heading */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            What&apos;s your goal in Germany?
          </h2>
        </div>

        {/* Three Large Option Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 w-full max-w-3xl mb-6 sm:mb-8">
          {/* Option 1: Study */}
          <button
            type="button"
            data-cursor="hover"
            disabled={isOverlay}
            onClick={() => handleStart({ kind: 'goal', value: 'Study' })}
            className="group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/90 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5 border border-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white">
              Study
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
              Bachelors, Masters &amp; prep courses
            </span>
          </button>

          {/* Option 2: Vocational training */}
          <button
            type="button"
            data-cursor="hover"
            disabled={isOverlay}
            onClick={() => handleStart({ kind: 'goal', value: 'Vocational training' })}
            className="group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/90 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3.5 border border-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white">
              Vocational training
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
              Duale Ausbildung &amp; paid apprenticeships
            </span>
          </button>

          {/* Option 3: Work */}
          <button
            type="button"
            data-cursor="hover"
            disabled={isOverlay}
            onClick={() => handleStart({ kind: 'goal', value: 'Work' })}
            className="group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/90 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3.5 border border-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white">
              Work
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
              Skilled employment &amp; Opportunity Card
            </span>
          </button>
        </div>

        {/* Input & Upload Controls */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 sm:mb-7">
          {/* Text Input with Send Button */}
          <form
            onSubmit={handleSubmitText}
            className="relative flex-1 flex items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isOverlay}
              placeholder="Or tell me in your own words..."
              className="w-full pl-4 pr-12 py-3 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isOverlay || !inputValue.trim()}
              aria-label="Send message"
              className="absolute right-1.5 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Upload Button */}
          <button
            type="button"
            data-cursor="hover"
            disabled={isOverlay}
            onClick={() => handleStart({ kind: 'upload', value: 'Document uploaded' })}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/80 hover:border-blue-500/40 text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0 disabled:pointer-events-none"
          >
            <Upload className="w-4 h-4 text-blue-500" />
            <span>Upload a document</span>
          </button>
        </div>

        {/* Trust Guarantee / Short Line */}
        <div className="flex items-center justify-center gap-2 text-center px-4 max-w-xl text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            I&apos;ll build your profile, check eligibility against set rules, and suggest your next step. I never guess your details.
          </span>
        </div>
      </div>
    </div>
  );
};
