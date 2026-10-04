import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { ChatMessage } from '../../context/ChatContext';

export interface GenieMessageProps {
  message: ChatMessage;
  isTyping?: boolean;
}

export const GenieMessage: React.FC<GenieMessageProps> = ({
  message,
  isTyping = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isGenie = message.sender === 'genie';

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
      <div className={`relative max-w-[85%] sm:max-w-[78%] ${isGenie ? '' : 'text-right'}`}>
        {isTyping ? (
          /* Typing indicator (three dots) */
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
          <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-black/5 dark:border-white/10 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs">
            {message.text}
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
