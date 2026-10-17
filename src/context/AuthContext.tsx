import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '../api/client';
import { UserProfileResponse } from '../api/types';

interface AuthContextType {
  user: UserProfileResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (defaultMode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  quickStartGuest: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const refreshUser = useCallback(async () => {
    try {
      const profile = await api.getMe();
      setUser(profile);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    refreshUser().finally(() => {
      if (mounted) setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  const openAuthModal = useCallback((defaultMode: 'login' | 'register' = 'login') => {
    setAuthModalMode(defaultMode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await api.login(email, password);
    await refreshUser();
    setIsAuthModalOpen(false);
  }, [refreshUser]);

  const register = useCallback(async (email: string, password: string) => {
    await api.register(email, password);
    await refreshUser();
    setIsAuthModalOpen(false);
  }, [refreshUser]);

  const quickStartGuest = useCallback(async () => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const guestEmail = `guest_${randomSuffix}@lotse.test`;
    const guestPassword = `LotseGuest#${randomSuffix}!`;
    await api.register(guestEmail, guestPassword);
    await refreshUser();
    setIsAuthModalOpen(false);
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout warning:', err);
    }
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.clear();
        window.localStorage.removeItem('lotse_token');
      } catch {
        // Ignore storage errors
      }
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        quickStartGuest,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
