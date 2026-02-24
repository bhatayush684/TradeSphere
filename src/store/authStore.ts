'use client';

import { create } from 'zustand';
import { authService } from '@/lib/services/auth.service';

type SessionUser = { id: string; email: string };

interface AuthState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: undefined,
  async login(email, password) {
    try {
      set({ isLoading: true, error: undefined });
      const user = await authService.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false, isAuthenticated: false });
    }
  },
  logout() {
    authService.clearSession();
    set({ user: null, isAuthenticated: false });
  },
  hydrate() {
    const existing = authService.getCurrentUser();
    if (existing) {
      set({ user: existing, isAuthenticated: true });
    }
  },
}));

