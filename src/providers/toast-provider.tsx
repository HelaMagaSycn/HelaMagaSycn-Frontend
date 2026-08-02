"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastTone = "success" | "error" | "info";
interface Toast { id: string; title: string; message?: string; tone: ToastTone }
interface ToastContextValue { showToast: (toast: Omit<Toast, "id">) => void }

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items.slice(-3), { ...toast, id }]);
    window.setTimeout(() => dismiss(id), 6500);
  }, [dismiss]);

  const value = useMemo(() => ({ showToast }), [showToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => {
          const Icon = toast.tone === "success" ? CheckCircle2 : toast.tone === "error" ? XCircle : Info;
          return (
            <div className={`toast toast-${toast.tone}`} key={toast.id} role="status">
              <Icon size={20} aria-hidden="true" />
              <div><strong>{toast.title}</strong>{toast.message && <p>{toast.message}</p>}</div>
              <button className="icon-button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification"><X size={16} /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
