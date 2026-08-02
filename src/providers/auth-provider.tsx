"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "oidc-client-ts";
import { getRealmRoles, getUserManager } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  accessToken?: string;
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (returnTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = (await getUserManager()?.getUser()) ?? null;
    setUser(current && !current.expired ? current : null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const manager = getUserManager();
    if (!manager) return;
    const loaded = (loadedUser: User) => setUser(loadedUser);
    const unloaded = () => setUser(null);
    void manager.getUser().then((current) => {
      setUser(current && !current.expired ? current : null);
      setIsLoading(false);
    });
    manager.events.addUserLoaded(loaded);
    manager.events.addUserUnloaded(unloaded);
    manager.events.addAccessTokenExpired(unloaded);
    return () => {
      manager.events.removeUserLoaded(loaded);
      manager.events.removeUserUnloaded(unloaded);
      manager.events.removeAccessTokenExpired(unloaded);
    };
  }, []);

  const signIn = useCallback(async (returnTo = "/") => {
    window.sessionStorage.setItem("helamaga:return-to", returnTo);
    await getUserManager()?.signinRedirect();
  }, []);

  const signOut = useCallback(async () => {
    await getUserManager()?.signoutRedirect();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    accessToken: user?.access_token,
    roles: user ? getRealmRoles(user.profile as Record<string, unknown>) : [],
    isAuthenticated: Boolean(user && !user.expired),
    isLoading,
    signIn,
    signOut,
    refresh,
  }), [isLoading, refresh, signIn, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
