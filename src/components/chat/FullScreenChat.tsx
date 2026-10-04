import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, ArrowLeft, Sun, Moon, X } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useTheme } from '../../context/ThemeContext';
import { GenieChatWindow } from './GenieChatWindow';

export const FullScreenChat: React.FC = () => {
  const {
    messages,
    welcomePlayed,
    triggerWelcomeMessage,
    resetChat,
    markFullScreenMounted,
  } = useChat();

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Notify transition manager that FullScreenChat has mounted
  useEffect(() => {
    markFullScreenMounted();
  }, [markFullScreenMounted]);

  // Direct visit to /chat with no messages: trigger welcome message immediately (no scroll gating)
  useEffect(() => {
    if (!welcomePlayed) {
      triggerWelcomeMessage();
    }
  }, [welcomePlayed, triggerWelcomeMessage]);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
      }
    };
    if (mobileDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [mobileDrawerOpen]);

  // Back to site action: navigates to / and resets scroll to top
  const handleBackToSite = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Truncate first user message for conversation title (approx 28 chars)
  const firstUserMessage = messages.find((m) => m.sender === 'user');
  const conversationTitle = firstUserMessage
    ? firstUserMessage.text.length > 28
      ? `${firstUserMessage.text.slice(0, 28)}...`
      : firstUserMessage.text
    : 'New conversation';

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand Link & Mobile Close Button */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={handleBackToSite}
            className="font-sans font-bold text-lg sm:text-xl tracking-wider text-zinc-950 dark:text-white hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
          >
            LOTSE
          </Link>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close menu"
            className="md:hidden p-1.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Conversation Button */}
        <button
          type="button"
          onClick={() => {
            resetChat();
            setMobileDrawerOpen(false);
          }}
          className="mt-5 flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-colors shadow-2xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>New conversation</span>
        </button>

        {/* Conversations List */}
        <div className="mt-6 flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
            Current
          </span>
          <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-xs font-medium text-blue-600 dark:text-blue-400">
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{conversationTitle}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions: Back to site and Theme toggle */}
      <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBackToSite}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to site</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-dvh w-full flex flex-row overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Desktop Sidebar */}
      <aside
        aria-label="Chat sidebar"
        className="hidden md:flex md:w-64 lg:w-72 flex-col shrink-0 border-r border-[var(--border-subtle)] bg-zinc-50/70 dark:bg-zinc-950/60 backdrop-blur-md"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          role="presentation"
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-zinc-50 dark:bg-zinc-950 border-r border-[var(--border-subtle)] shadow-2xl transition-transform duration-300 md:hidden ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Main Full-Screen Chat Viewport */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-transparent overflow-hidden">
        <GenieChatWindow
          mode="full"
          className="w-full h-full"
          onOpenMobileMenu={() => setMobileDrawerOpen(true)}
          onBackToSite={handleBackToSite}
          showBackToSite
        />
      </main>
    </div>
  );
};
