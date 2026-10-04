import { useState, useEffect } from 'react';

const SCROLL_KEYS = new Set([
  'PageDown',
  'PageUp',
  'Space',
  ' ',
  'ArrowDown',
  'ArrowUp',
  'End',
  'Home',
]);

/**
 * useUserScrolled
 * Detects intentional user scrolling vs browser automated scroll restoration:
 * - wheel event
 * - touchmove event
 * - keydown: PageDown, PageUp, Space, ArrowDown, ArrowUp, End, Home
 * - scroll event: window.scrollY changed >40px from mount AND >=800ms elapsed
 * - click on in-page anchor navigation (e.g. #showcase)
 */
export function useUserScrolled(): boolean {
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || hasUserScrolled) return;

    const mountTime = Date.now();
    const mountScrollY = window.scrollY;

    const markScrolled = () => {
      setHasUserScrolled(true);
      cleanup();
    };

    const handleWheel = () => {
      markScrolled();
    };

    const handleTouchMove = () => {
      markScrolled();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) {
        markScrolled();
      }
    };

    const handleScroll = () => {
      if (Date.now() - mountTime >= 800 && Math.abs(window.scrollY - mountScrollY) > 40) {
        markScrolled();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href === '#showcase' || href?.startsWith('#')) {
          markScrolled();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick, { passive: true, capture: true });

    const cleanup = () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick, true);
    };

    return cleanup;
  }, [hasUserScrolled]);

  return hasUserScrolled;
}
