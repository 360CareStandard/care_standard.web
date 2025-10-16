// stores/auth-store.ts

import { User } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthed: boolean;
  setAuth: (payload: { token: string; user: User }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthed: false,
      setAuth: ({ token, user }) => set({ token, user, isAuthed: true }),
      clearAuth: () => set({ token: null, user: null, isAuthed: false }),
    }),
    {
      name: "nc-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthed: state.isAuthed,
      }),
    }
  )
);
