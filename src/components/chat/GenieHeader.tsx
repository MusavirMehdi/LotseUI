import React from 'react';
import { Sparkles, Menu, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface GenieHeaderProps {
  mode?: 'mini' | 'full';
  className?: string;
  onOpenMobileMenu?: () => void;
  onBackToSite?: () => void;
  showBackToSite?: boolean;
}

export const GenieHeader: React.FC<GenieHeaderProps> = ({
  mode = 'mini',
  className = '',
  onOpenMobileMenu,
  onBackToSite,
  showBackToSite = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-zinc-50/90 dark:bg-zinc-950/80 backdrop-blur-md select-none shrink-0 ${
        mode === 'full' ? 'px-4 sm:px-6 py-3.5 sm:py-4' : 'px-4 py-3'
      } ${className}`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Hamburger Trigger (Full Mode only) */}
        {mode === 'full' && onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open sidebar drawer"
            className="md:hidden p-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Brand style avatar */}
        <div
          aria-hidden="true"
          className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-indigo-500/10 dark:from-blue-500/25 dark:via-blue-600/15 dark:to-indigo-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-xs ${
            mode === 'full' ? 'w-8 h-8' : 'w-7 h-7'
          }`}
        >
          <Sparkles className={mode === 'full' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        </div>

        {/* Identity & Status */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs sm:text-sm tracking-tight text-zinc-900 dark:text-white">
            LOTSE GENIE
          </span>
          {/* Online status dot with a gentle pulse */}
          <span
            className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
            title="Online"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>Online</span>
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {mode === 'full' && showBackToSite && onBackToSite && (
          <button
            type="button"
            onClick={onBackToSite}
            aria-label="Back to site"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to site</span>
          </button>
        )}

        {mode === 'full' && (
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-blue-600" />
            )}
          </button>
        )}

        {mode === 'mini' && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
            <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              AI Guide
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
