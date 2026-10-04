import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  sender: 'genie' | 'user';
  text: string;
  timestamp: number;
}

export interface TransitionRect {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius?: string;
}

export interface ChatContextType {
  messages: ChatMessage[];
  welcomePlayed: boolean;
  isTransitioning: boolean;
  isTyping: boolean;
  transitionRect: TransitionRect | null;
  isFullScreenMounted: boolean;
  triggerWelcomeMessage: () => void;
  sendUserMessage: (text: string) => void;
  startTransition: (rect?: TransitionRect | null) => void;
  endTransition: () => void;
  markFullScreenMounted: () => void;
  resetChat: () => void;
}

export const WELCOME_MESSAGE_TEXT = `Welcome! I'm LOTSE GENIE, your personal guide to opportunities in Germany. Whether you're planning to study, pursue vocational training or explore career opportunities, I'll help you figure out where to begin.

What brings you to Germany?`;

const STORAGE_KEY_MESSAGES = 'lotse_chat_messages';
const STORAGE_KEY_WELCOME = 'lotse_chat_welcome_played';

const loadMessagesFromStorage = (): ChatMessage[] => {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.sessionStorage.getItem(STORAGE_KEY_MESSAGES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (m): m is ChatMessage =>
          typeof m === 'object' &&
          m !== null &&
          typeof m.id === 'string' &&
          (m.sender === 'genie' || m.sender === 'user') &&
          typeof m.text === 'string' &&
          typeof m.timestamp === 'number'
      );
    }
    return [];
  } catch {
    return [];
  }
};

const loadWelcomePlayedFromStorage = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(STORAGE_KEY_WELCOME) === 'true';
  } catch {
    return false;
  }
};

const saveMessagesToStorage = (messages: ChatMessage[]) => {
  try {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  } catch {
    // Ignore storage write issues
  }
};

const saveWelcomePlayedToStorage = (played: boolean) => {
  try {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(STORAGE_KEY_WELCOME, played ? 'true' : 'false');
    }
  } catch {
    // Ignore storage write issues
  }
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessagesFromStorage);
  const [welcomePlayed, setWelcomePlayed] = useState<boolean>(loadWelcomePlayedFromStorage);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [transitionRect, setTransitionRect] = useState<TransitionRect | null>(null);
  const [isFullScreenMounted, setIsFullScreenMounted] = useState<boolean>(false);

  // Guarantee clean transition state and body overflow on mount
  useEffect(() => {
    setIsTransitioning(false);
    setTransitionRect(null);
    setIsFullScreenMounted(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }, []);

  // Sync state to sessionStorage whenever messages change
  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  // Sync welcomePlayed to sessionStorage
  useEffect(() => {
    saveWelcomePlayedToStorage(welcomePlayed);
  }, [welcomePlayed]);

  const triggerWelcomeMessage = useCallback(() => {
    setWelcomePlayed((prevPlayed) => {
      if (prevPlayed) return prevPlayed;

      saveWelcomePlayedToStorage(true);

      const shouldReduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const welcomeMsg: ChatMessage = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `genie-${Date.now()}`,
        sender: 'genie',
        text: WELCOME_MESSAGE_TEXT,
        timestamp: Date.now(),
      };

      if (shouldReduceMotion) {
        setMessages((prev) => {
          if (prev.some((m) => m.text === WELCOME_MESSAGE_TEXT && m.sender === 'genie')) {
            return prev;
          }
          return [...prev, welcomeMsg];
        });
      } else {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => {
            if (prev.some((m) => m.text === WELCOME_MESSAGE_TEXT && m.sender === 'genie')) {
              return prev;
            }
            return [...prev, welcomeMsg];
          });
        }, 900);
      }

      return true;
    });
  }, []);

  const sendUserMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
  }, []);

  const startTransition = useCallback((rect?: TransitionRect | null) => {
    setTransitionRect(rect || null);
    setIsFullScreenMounted(false);
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    setTransitionRect(null);
    setIsFullScreenMounted(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }, []);

  const markFullScreenMounted = useCallback(() => {
    setIsFullScreenMounted(true);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setWelcomePlayed(false);
    setIsTransitioning(false);
    setIsTyping(false);
    setTransitionRect(null);
    setIsFullScreenMounted(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
        window.sessionStorage.removeItem(STORAGE_KEY_WELCOME);
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        welcomePlayed,
        isTransitioning,
        isTyping,
        transitionRect,
        isFullScreenMounted,
        triggerWelcomeMessage,
        sendUserMessage,
        startTransition,
        endTransition,
        markFullScreenMounted,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
