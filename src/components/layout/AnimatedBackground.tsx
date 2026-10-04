import React from 'react';

/**
 * AnimatedBackground
 * Fixed, full-viewport layer behind content hosting base color and 3-4 blurred blobs.
 * Blobs drift via pure CSS transform keyframes and cycle slowly through the CSS variable palette.
 * Blurs are strictly static (never animated).
 * Respects prefers-reduced-motion (static positions, fully visible).
 * Mobile (<768px) displays 2 smaller blobs for performance and legibility.
 */
export const AnimatedBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 bg-[var(--bg-base)] pointer-events-none overflow-hidden select-none transition-colors duration-200"
    >
      {/* Blob 1: Top-Left Primary Drift (≥40vw, active on all viewports) */}
      <div
        className="blob-1 absolute -top-[12vw] -left-[10vw] w-[48vw] h-[48vw] min-w-[340px] min-h-[340px] rounded-full [filter:blur(95px)] sm:[filter:blur(135px)]"
      />

      {/* Blob 2: Center-Right Ambient Drift (≥40vw, active on all viewports) */}
      <div
        className="blob-2 absolute top-[28vh] -right-[10vw] w-[46vw] h-[46vw] min-w-[320px] min-h-[320px] rounded-full [filter:blur(90px)] sm:[filter:blur(130px)]"
      />

      {/* Blob 3: Bottom-Left Soft Accent Drift (≥40vw, hidden on mobile <768px) */}
      <div
        className="blob-3 hidden md:block absolute bottom-[8vh] left-[12vw] w-[44vw] h-[44vw] min-w-[340px] min-h-[340px] rounded-full [filter:blur(120px)]"
      />

      {/* Blob 4: Bottom-Right Subtle Warm Accent Drift (≥40vw, hidden on mobile <768px) */}
      <div
        className="blob-4 hidden md:block absolute -bottom-[12vw] right-[18vw] w-[42vw] h-[42vw] min-w-[320px] min-h-[320px] rounded-full [filter:blur(110px)]"
      />

      {/* Ultra-fine matrix grain/grid texture overlay to preserve tactile studio depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)] opacity-70" />
    </div>
  );
};
