import React, { useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { GenieChatWindow } from './GenieChatWindow';

export const GenieShowcase: React.FC = () => {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { welcomePlayed, triggerWelcomeMessage } = useChat();

  useIntersectionObserver(showcaseRef, {
    threshold: 0.5,
    maxTopRatio: 0.7,
    requireUserScroll: true,
    freezeOnceVisible: true,
    enabled: !welcomePlayed,
    onIntersect: () => {
      if (!welcomePlayed) {
        triggerWelcomeMessage();
      }
    },
  });

  return (
    <div
      ref={showcaseRef}
      className="w-full flex justify-center items-center py-1 sm:py-2"
    >
      <GenieChatWindow mode="mini" />
    </div>
  );
};
