import React, { useEffect } from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ label: string; href: string }>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navLinks }) => {
  const { theme, toggleTheme } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-zinc-950/95 dark:bg-black/95 backdrop-blur-xl text-white p-6 sm:p-8 animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="font-sans font-bold text-xl tracking-wider text-white">
          LOTSE
        </span>

        <button
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links List */}
      <nav className="flex flex-col gap-6 my-auto py-8">
        {navLinks.map((link, index) => {
          const numberLabel = String(index + 1).padStart(2, '0');
          return (
            <a
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="group flex items-baseline justify-between py-2 border-b border-white/5 hover:border-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
            >
              <span className="text-2xl font-medium text-zinc-300 group-hover:text-white transition-colors">
                {link.label}
              </span>
              <span className="font-mono text-xs text-zinc-600 group-hover:text-blue-400 transition-colors">
                {numberLabel}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Appearance</span>
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-300 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-colors focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
