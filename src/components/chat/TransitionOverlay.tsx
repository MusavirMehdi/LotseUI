import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { GenieChatWindow } from './GenieChatWindow';

/**
 * TransitionOverlay
 * Shared element overlay for mini-to-fullscreen expansion transition:
 * - Mounts at app root with fixed positioning matching the measured mini window
 * - Locks body scroll during the transition
 * - Animates to full viewport (top: 0, left: 0, width: 100vw, height: 100vh) over 480ms
 * - Navigates to /chat when expansion completes
 * - Stays mounted until FullScreenChat reports mount, then fades out over 150ms
 * - Includes a 2.5s safety timeout so the app can never become stuck
 */
export const TransitionOverlay: React.FC = () => {
  const {
    isTransitioning,
    transitionRect,
    isFullScreenMounted,
    endTransition,
  } = useChat();

  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const safetyTimeoutRef = useRef<number | null>(null);

  // Lock body scroll and set up safety timeout
  useEffect(() => {
    if (isTransitioning) {
      document.body.style.overflow = 'hidden';

      safetyTimeoutRef.current = window.setTimeout(() => {
        document.body.style.overflow = '';
        endTransition();
      }, 2500);

      return () => {
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
        }
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setIsFadingOut(false);
    }
  }, [isTransitioning, endTransition]);

  // When FullScreenChat has mounted at /chat, trigger smooth fade out
  useEffect(() => {
    if (isTransitioning && isFullScreenMounted) {
      setIsFadingOut(true);
    }
  }, [isTransitioning, isFullScreenMounted]);

  if (!isTransitioning || !transitionRect) {
    return null;
  }

  const handleExpandComplete = () => {
    // Navigate to /chat once expanded
    navigate('/chat');
  };

  const handleFadeComplete = () => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }
    document.body.style.overflow = '';
    endTransition();
  };

  return (
    <motion.div
      initial={{
        top: transitionRect.top,
        left: transitionRect.left,
        width: transitionRect.width,
        height: transitionRect.height,
        borderRadius: transitionRect.borderRadius || '16px',
        opacity: 1,
      }}
      animate={
        isFadingOut
          ? {
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0,
              opacity: 0,
            }
          : {
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0,
              opacity: 1,
            }
      }
      transition={
        isFadingOut
          ? { duration: 0.15, ease: 'easeOut' }
          : {
              duration: 0.48,
              ease: [0.16, 1, 0.3, 1],
            }
      }
      onAnimationComplete={() => {
        if (isFadingOut) {
          handleFadeComplete();
        } else {
          handleExpandComplete();
        }
      }}
      style={{
        position: 'fixed',
        zIndex: 100,
        overflow: 'hidden',
      }}
      className="bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xl flex flex-col"
    >
      <GenieChatWindow mode="full" className="w-full h-full" />
    </motion.div>
  );
};
