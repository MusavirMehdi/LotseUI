import { useEffect, useRef, RefObject } from 'react';
import { useUserScrolled } from './useUserScrolled';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  onIntersect?: () => void;
  enabled?: boolean;
  requireUserScroll?: boolean;
  maxTopRatio?: number;
}

export function useIntersectionObserver(
  elementRef: RefObject<HTMLElement | null>,
  {
    threshold = 0.5,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = true,
    onIntersect,
    enabled = true,
    requireUserScroll = false,
    maxTopRatio,
  }: UseIntersectionObserverOptions = {}
): { hasUserScrolled: boolean } {
  const onIntersectRef = useRef(onIntersect);
  onIntersectRef.current = onIntersect;

  const hasUserScrolled = useUserScrolled();
  const frozenRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!enabled || !node || typeof IntersectionObserver !== 'function' || frozenRef.current) {
      return;
    }

    const checkAndTrigger = () => {
      if (frozenRef.current) return;

      if (requireUserScroll && !hasUserScrolled) {
        return;
      }

      const rect = node.getBoundingClientRect();
      if (maxTopRatio !== undefined && rect.top >= window.innerHeight * maxTopRatio) {
        return;
      }

      frozenRef.current = true;
      observerRef.current?.disconnect();
      onIntersectRef.current?.();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          checkAndTrigger();
        }
      },
      { threshold, root, rootMargin }
    );

    observerRef.current = observer;
    observer.observe(node);

    // If user scrolled while the element is already intersecting
    if (requireUserScroll && hasUserScrolled) {
      const rect = node.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        checkAndTrigger();
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [
    elementRef,
    threshold,
    root,
    rootMargin,
    freezeOnceVisible,
    enabled,
    requireUserScroll,
    hasUserScrolled,
    maxTopRatio,
  ]);

  return { hasUserScrolled };
}

export { useUserScrolled };
