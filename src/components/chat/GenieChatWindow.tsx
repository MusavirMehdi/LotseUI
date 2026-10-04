import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { Sparkles, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { GenieHeader } from './GenieHeader';
import { GenieMessage } from './GenieMessage';
import { GenieInput } from './GenieInput';

export interface GenieChatWindowProps {
  mode?: 'mini' | 'full';
  className?: string;
  onOpenMobileMenu?: () => void;
  onBackToSite?: () => void;
  showBackToSite?: boolean;
}

export const GenieChatWindow: React.FC<GenieChatWindowProps> = ({
  mode = 'mini',
  className = '',
  onOpenMobileMenu,
  onBackToSite,
  showBackToSite = false,
}) => {
  const {
    messages,
    welcomePlayed,
    isTyping,
    sendUserMessage,
    startTransition,
  } = useChat();

  const navigate = useNavigate();
  const windowRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const isFirstMountRef = useRef(true);
  const shouldReduceMotion = useReducedMotion();

  // Auto-scroll message container ONLY when a new message is added, never on first mount or page-level
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevMessagesLengthRef.current = messages.length;
      return;
    }

    if (messages.length > prevMessagesLengthRef.current) {
      prevMessagesLengthRef.current = messages.length;
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: shouldReduceMotion ? 'auto' : 'smooth',
        });
      }
    }
  }, [messages.length, shouldReduceMotion]);

  const isEmpty = messages.length === 0 && !isTyping;
  const isInputDisabled = messages.length === 0 && !welcomePlayed;

  // First user message index to anchor the single system note
  const firstUserMessageIndex = messages.findIndex((m) => m.sender === 'user');

  const handleSendMessage = (text: string) => {
    const hasUserMessages = messages.some((m) => m.sender === 'user');

    // Mini mode first user message triggers expansion transition
    if (mode === 'mini' && !hasUserMessages) {
      const isReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const container = windowRef.current;

      if (!container) {
        sendUserMessage(text);
        navigate('/chat');
        return;
      }

      const rect = container.getBoundingClientRect();

      // Fallback: direct navigation with no overlay
      if (isReducedMotion || isMobile || rect.width === 0 || rect.height === 0) {
        sendUserMessage(text);
        navigate('/chat');
        return;
      }

      // Valid desktop expansion transition
      sendUserMessage(text);
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
      return;
    }

    // Normal submission (full mode or subsequent mini submissions)
    sendUserMessage(text);
  };

  return (
    <div
      ref={windowRef}
      className={`flex flex-col overflow-hidden text-[var(--text-primary)] transition-all ${
        mode === 'mini'
          ? 'w-full max-w-2xl h-[380px] sm:h-[430px] lg:h-[460px] rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-xl'
          : 'w-full h-full flex-1 bg-white/80 dark:bg-zinc-900/80'
      } ${className}`}
    >
      {/* 1. Header */}
      <GenieHeader
        mode={mode}
        onOpenMobileMenu={onOpenMobileMenu}
        onBackToSite={onBackToSite}
        showBackToSite={showBackToSite}
      />

      {/* 2. Scrollable Message List */}
      <div
        ref={scrollContainerRef}
        aria-live="polite"
        aria-atomic="false"
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5"
      >
        {isEmpty ? (
          /* Subtle Empty State before welcome message */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-2.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Say hello to start
            </p>
            <p className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 max-w-xs">
              Your personal guide to study, Ausbildung, and career in Germany
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                <GenieMessage message={message} />
                {/* One small, clearly labelled system note under the first user message */}
                {index === firstUserMessageIndex && (
                  <div className="flex justify-center my-3 sm:my-4 select-none">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-zinc-600 dark:text-zinc-400 text-[11px] sm:text-xs max-w-sm text-center leading-snug">
                      <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Demo mode: LOTSE GENIE&apos;s replies will appear here once the AI service is connected.</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}

            {isTyping && (
              <GenieMessage
                message={{
                  id: 'typing-temp',
                  sender: 'genie',
                  text: '',
                  timestamp: Date.now(),
                }}
                isTyping
              />
            )}
          </>
        )}
      </div>

      {/* 3. Input */}
      <GenieInput
        onSubmit={handleSendMessage}
        disabled={isInputDisabled}
        placeholder={
          isInputDisabled
            ? 'Say hello to start...'
            : 'Ask LOTSE GENIE about studying, jobs, or visas...'
        }
      />
    </div>
  );
};
