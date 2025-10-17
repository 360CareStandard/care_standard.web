// stores/auth-store.ts
import { User } from "@/types/user";
import { Workspace } from "@/types/workspace";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthed: boolean;
  workspace: Workspace;

  setAuth: (payload: { token: string; user: User }) => void;
  setToken: (token: string | null) => void; // optional but handy
  setWorkspace: (w: Workspace) => void; // NEW
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthed: false,
      workspace: null,

      setAuth: ({ token, user }) => set({ token, user, isAuthed: true }),
      setToken: (token) =>
        set((s) => ({ token, isAuthed: !!token && !!s.user })),
      setWorkspace: (workspace) => set({ workspace }),

      clearAuth: () =>
        set({ token: null, user: null, isAuthed: false, workspace: null }),
    }),
    {
      name: "nc-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        isAuthed: s.isAuthed,
        workspace: s.workspace, // persist selected workspace
      }),
      version: 2,
      migrate: (persisted: any, version) => {
        if (version < 2) return { ...persisted, workspace: null };
        return persisted;
      },
    }
  )
);
