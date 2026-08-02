"use client";

import { LockKeyhole } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, signIn } = useAuth();
  useEffect(() => { if (!isLoading && !isAuthenticated) void signIn(pathname); }, [isAuthenticated, isLoading, pathname, signIn]);
  if (isLoading || !isAuthenticated) return <main className="centered-page"><div className="loading-card"><span><LockKeyhole /></span><h1>Securing your session</h1><p>You’ll be redirected to sign in before continuing.</p><div className="loading-bar" /></div></main>;
  return children;
}
