import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { GenieHeader } from './GenieHeader';
import { GenieMessage } from './GenieMessage';
import { GenieInput } from './GenieInput';
import { AgentActivityIndicator } from './AgentActivityIndicator';
import { FileUploadModal } from './FileUploadModal';

export interface GenieChatWindowProps {
  mode?: 'mini' | 'full';
  className?: string;
  onOpenMobileMenu?: () => void;
  onBackToSite?: () => void;
  showBackToSite?: boolean;
  onRetry?: () => void;
}

export const GenieChatWindow: React.FC<GenieChatWindowProps> = ({
  mode = 'mini',
  className = '',
  onOpenMobileMenu,
  onBackToSite,
  showBackToSite = false,
  onRetry,
}) => {
  const {
    messages,
    isTyping,
    isAgentRunning,
    currentAgentReason,
    currentIteration,
    currentToolName,
    pendingQuestion,
    activePathway,
    sendUserMessage,
    sendAnswer,
    sendUpload,
    resolveConflict,
    stopCurrentTurn,
    startTransition,
    retryLastAction,
  } = useChat();

  const handleRetry = onRetry || retryLastAction;

  const navigate = useNavigate();
  const windowRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const isFirstMountRef = useRef(true);
  const shouldReduceMotion = useReducedMotion();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

  const isEmpty = messages.length === 0 && !isTyping && !isAgentRunning;

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

    // Normal submission
    sendUserMessage(text);
  };

  const handleUploadSuccess = (uploadId: string, fileName: string, kind: string) => {
    sendUpload(uploadId, fileName, kind);
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
        activePathway={activePathway}
        statusText={
          isAgentRunning
            ? 'Thinking...'
            : pendingQuestion
              ? 'Awaiting Answer'
              : 'Connected'
        }
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
            {messages.map((message) => (
              <GenieMessage
                key={message.id}
                message={message}
                onAnswer={sendAnswer}
                onResolveConflict={resolveConflict}
                onRetry={handleRetry}
              />
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

      {/* 3. Live Agent Activity Indicator */}
      {isAgentRunning && (
        <div className="px-4">
          <AgentActivityIndicator
            isRunning={isAgentRunning}
            currentReason={currentAgentReason}
            iteration={currentIteration}
            toolName={currentToolName}
            onStop={stopCurrentTurn}
          />
        </div>
      )}

      {/* 4. Input */}
      <GenieInput
        onSubmit={handleSendMessage}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        disabled={isAgentRunning}
        placeholder={
          isAgentRunning
            ? 'LOTSE GENIE is evaluating requirements...'
            : 'Ask LOTSE GENIE about studying, jobs, or visas...'
        }
      />

      {/* Document Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};
