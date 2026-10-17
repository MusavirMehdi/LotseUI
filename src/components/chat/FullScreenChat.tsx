import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  MessageSquare,
  ArrowLeft,
  Sun,
  Moon,
  X,
  LogOut,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { GenieChatWindow } from './GenieChatWindow';
import { ProfileSidebar } from './ProfileSidebar';

export const FullScreenChat: React.FC = () => {
  const {
    messages,
    welcomePlayed,
    hasStarted,
    activePathway,
    triggerWelcomeMessage,
    sendUserMessage,
    sendGoal,
    sendUpload,
    consumePendingStartAction,
    resetChat,
    runManualQualification,
    markFullScreenMounted,
  } = useChat();

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'chat' | 'profile'>('profile');

  // Notify transition manager that FullScreenChat has mounted
  useEffect(() => {
    markFullScreenMounted();
  }, [markFullScreenMounted]);

  const hasConsumedActionRef = useRef(false);

  // Check for pending start action from landing page, or trigger welcome on direct visit
  useEffect(() => {
    if (hasConsumedActionRef.current) return;
    const pending = consumePendingStartAction();
    if (pending) {
      hasConsumedActionRef.current = true;
      if (pending.kind === 'goal' && pending.value) {
        const goalValue = pending.value.toLowerCase().includes('training') || pending.value.toLowerCase().includes('ausbildung')
          ? 'training'
          : pending.value.toLowerCase().includes('work')
            ? 'work'
            : 'study';
        sendGoal(goalValue as any);
      } else if (pending.kind === 'upload' && pending.uploadId) {
        sendUpload(
          pending.uploadId,
          pending.fileName || 'Uploaded Document',
          pending.documentKind || 'degree'
        );
      } else if (pending.kind === 'text' && pending.value) {
        sendUserMessage(pending.value);
      }
    } else if (!hasStarted && !welcomePlayed && messages.length === 0) {
      triggerWelcomeMessage();
    }
  }, [
    consumePendingStartAction,
    sendUserMessage,
    sendGoal,
    sendUpload,
    hasStarted,
    welcomePlayed,
    messages.length,
    triggerWelcomeMessage,
  ]);

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

  const handleBackToSite = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const firstUserMessage = messages.find((m) => m.sender === 'user');
  const conversationTitle = firstUserMessage
    ? firstUserMessage.text.length > 28
      ? `${firstUserMessage.text.slice(0, 28)}...`
      : firstUserMessage.text
    : 'New conversation';

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none bg-[var(--surface-card)]">
      {/* Top Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
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
          className="md:hidden p-1.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Switcher: Profile vs Conversation Info */}
      <div className="flex border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-1 m-3 rounded-xl">
        <button
          type="button"
          onClick={() => setSidebarTab('profile')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            sidebarTab === 'profile'
              ? 'bg-[var(--surface-card)] text-zinc-950 dark:text-white shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Verified Profile
        </button>
        <button
          type="button"
          onClick={() => setSidebarTab('chat')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            sidebarTab === 'chat'
              ? 'bg-[var(--surface-card)] text-zinc-950 dark:text-white shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Session
        </button>
      </div>

      {/* Middle Scrollable Section */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {sidebarTab === 'profile' ? (
          <ProfileSidebar onRunQualification={runManualQualification} />
        ) : (
          <div className="p-4 space-y-4">
            {/* New Conversation Button */}
            <button
              type="button"
              onClick={() => {
                resetChat();
                setMobileDrawerOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New conversation</span>
            </button>

            {/* Current Active Conversation */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
                Current Pathway &amp; Topic
              </span>
              <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-xs font-medium text-blue-600 dark:text-blue-400">
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {activePathway ? `${activePathway.toUpperCase()} • ` : ''}{conversationTitle}
                </span>
              </div>
            </div>

            {/* Deterministic Engine Guarantee Notice */}
            <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Hallucinations</span>
              </div>
              Eligibility is governed by legal rulesets. The model only reads and communicates; deterministic code checks qualifications.
            </div>
          </div>
        )}
      </div>

      {/* Bottom User & System Controls */}
      <div className="p-4 border-t border-[var(--border-subtle)] space-y-3">
        {/* Auth status row */}
        <div className="flex items-center justify-between text-xs">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-bold">
                {user.email[0].toUpperCase()}
              </div>
              <span className="truncate text-zinc-700 dark:text-zinc-300 max-w-[120px]">
                {user.email}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in / Save data</span>
            </button>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => logout()}
              title="Sign out"
              aria-label="Sign out"
              className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Back to site and Theme toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={handleBackToSite}
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to site</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* 1. Desktop Left Sidebar */}
      <aside
        aria-label="Chat sidebar"
        className="hidden md:flex flex-col w-80 lg:w-96 border-r border-[var(--border-subtle)] bg-[var(--surface-card)] shrink-0 z-20"
      >
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Navigation */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 md:hidden flex"
        >
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative flex flex-col w-4/5 max-w-sm h-full bg-[var(--surface-card)] z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* 3. Main Chat Viewport */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[var(--bg-base)] relative">
        <GenieChatWindow
          mode="full"
          showBackToSite={true}
          onBackToSite={handleBackToSite}
          onOpenMobileMenu={() => setMobileDrawerOpen(true)}
        />
      </main>
    </div>
  );
};
