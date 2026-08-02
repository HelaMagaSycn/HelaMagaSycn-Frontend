"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { titleCase } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import type { Booking, BookingStatus } from "@/types/api";

export interface BookingNotification {
  id: string;
  bookingId: string;
  status: BookingStatus;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationContextValue {
  notifications: BookingNotification[];
  unreadCount: number;
  markAllRead: () => void;
  clear: () => void;
}

const STORAGE_KEY = "helamaga:notifications";
const STATUS_KEY = "helamaga:booking-statuses";
const TERMINAL = new Set<BookingStatus>(["CONFIRMED", "SEAT_UNAVAILABLE", "PAYMENT_FAILED", "HOLD_EXPIRED", "REFUNDED", "FAILED"]);
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function notificationFor(booking: Booking): Omit<BookingNotification, "id" | "createdAt" | "read"> {
  const success = booking.status === "CONFIRMED";
  return {
    bookingId: booking.id,
    status: booking.status,
    title: success ? "Your booking is confirmed" : `Booking ${titleCase(booking.status)}`,
    message: success
      ? "Your seat is secured. Your digital ticket is ready in My bookings."
      : booking.failureReason ?? "Open the booking to view the latest details.",
  };
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<BookingNotification[]>([]);

  useEffect(() => {
    let stored: BookingNotification[] = [];
    try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as BookingNotification[]; } catch { stored = []; }
    queueMicrotask(() => setNotifications(stored));
  }, []);

  const bookings = useQuery({
    queryKey: ["bookings", accessToken],
    queryFn: () => api.bookings(accessToken!),
    enabled: isAuthenticated && Boolean(accessToken),
    refetchInterval: 5000,
    retry: 1,
  });

  useEffect(() => {
    if (!bookings.data) return;
    let previous: Record<string, BookingStatus> = {};
    try { previous = JSON.parse(localStorage.getItem(STATUS_KEY) ?? "{}") as Record<string, BookingStatus>; } catch { previous = {}; }
    const next = { ...previous };
    const additions: BookingNotification[] = [];

    for (const booking of bookings.data) {
      const changed = previous[booking.id] && previous[booking.id] !== booking.status;
      if (changed && TERMINAL.has(booking.status)) {
        const content = notificationFor(booking);
        additions.push({ ...content, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false });
        showToast({ tone: booking.status === "CONFIRMED" ? "success" : "error", title: content.title, message: content.message });
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(content.title, { body: content.message, icon: "/helamaga-symbol.png" });
        }
      }
      next[booking.id] = booking.status;
    }
    localStorage.setItem(STATUS_KEY, JSON.stringify(next));
    if (additions.length) {
      queueMicrotask(() => setNotifications((current) => {
          const updated = [...additions, ...current].slice(0, 40);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        }));
    }
  }, [bookings.data, showToast]);

  const update = (next: BookingNotification[]) => {
    setNotifications(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  const value = useMemo<NotificationContextValue>(() => ({
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    markAllRead: () => update(notifications.map((item) => ({ ...item, read: true }))),
    clear: () => update([]),
  }), [notifications]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used inside NotificationProvider");
  return context;
}
