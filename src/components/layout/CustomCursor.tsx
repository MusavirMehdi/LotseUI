import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

/**
 * CustomCursor
 * High-performance, hardware-accelerated dual-layer pointer:
 * - 8px solid center dot tracking client coordinates immediately via useMotionValue
 * - 36px ring (1.5px border) following with soft spring physics (stiffness 300, damping 28)
 * - Expands to ~56px with soft tint over links, buttons, and [data-cursor="hover"]
 * - Scales to 0.85 on mousedown
 * - Suppresses native cursor, except reverts to native I-beam cursor on text inputs
 * - Strictly disabled on touchscreen / coarse pointer devices
 * - Reverts to lag-free dot-only mode when prefers-reduced-motion is active
 */
export const CustomCursor: React.FC = () => {
  const [isPointerDevice, setIsPointerDevice] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isTextInput, setIsTextInput] = useState<boolean>(false);

  const shouldReduceMotion = useReducedMotion();

  // Position motion values (GPU transforms, zero React re-renders for coordinates)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Soft spring config for the trailing ring
  const springConfig = { stiffness: 300, damping: 28 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  // Check for fine pointer capability on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    setIsPointerDevice(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerDevice(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Window pointer listeners
  useEffect(() => {
    if (!isPointerDevice) return;

    const handlePointerMove = (e: PointerEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect text inputs
      const isInput = Boolean(
        target.closest(
          'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"], [contenteditable=""]'
        )
      );
      setIsTextInput(isInput);

      // Detect clickable elements
      const isClickable = Boolean(
        target.closest('a, button, [role="button"], [data-cursor="hover"], input[type="submit"], input[type="button"]')
      );
      setIsHovered(isClickable && !isInput);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isPointerDevice, isVisible, cursorX, cursorY]);

  // Sync global native cursor suppression
  useEffect(() => {
    if (isPointerDevice && isVisible && !isTextInput) {
      document.documentElement.classList.add('custom-cursor-active');
    } else {
      document.documentElement.classList.remove('custom-cursor-active');
    }

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [isPointerDevice, isVisible, isTextInput]);

  // Render nothing on touch or coarse pointers
  if (!isPointerDevice) {
    return null;
  }

  const activeOpacity = isVisible && !isTextInput ? 1 : 0;

  // Ring scale calculation:
  // Default: 1 (36px)
  // Hovered: 56/36 ≈ 1.55 (56px)
  // MouseDown: 0.85x scale
  let ringScale = 1;
  if (isHovered) ringScale = 1.55;
  if (isMouseDown) ringScale *= 0.85;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] select-none overflow-hidden"
    >
      {/* Trailing Ring (hidden when prefers-reduced-motion is active) */}
      {!shouldReduceMotion && (
        <motion.div
          className="fixed top-0 left-0 w-9 h-9 rounded-full border-[1.5px] border-[#2563eb] dark:border-[#38bdf8] pointer-events-none transition-colors duration-200"
          style={{
            x: ringX,
            y: ringY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            scale: ringScale,
            opacity: activeOpacity,
            backgroundColor: isHovered
              ? 'rgba(37, 99, 235, 0.12)'
              : 'rgba(37, 99, 235, 0)',
          }}
          transition={{
            scale: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.15 },
            backgroundColor: { duration: 0.18 },
          }}
        />
      )}

      {/* Immediate Pointer Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#2563eb] dark:bg-[#38bdf8] pointer-events-none shadow-xs"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: activeOpacity,
          scale: isMouseDown ? 0.75 : 1,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { duration: 0.1 },
        }}
      />
    </div>
  );
};
