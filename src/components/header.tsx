"use client";

import { Bell, ChevronDown, LogIn, Menu, Ticket, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { useAuth } from "@/providers/auth-provider";
import { useNotifications } from "@/providers/notification-provider";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const displayName = (user?.profile.name as string | undefined) ?? (user?.profile.email as string | undefined) ?? "Passenger";
  const links = [{ href: "/", label: "Plan a journey" }, { href: "/bookings", label: "My bookings" }, { href: "/help", label: "Travel help" }];

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Brand />
        <nav className={open ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""} onClick={() => setOpen(false)}>{link.label}</Link>)}
        </nav>
        <div className="nav-actions">
          {isAuthenticated && (
            <Link className="notification-button" href="/notifications" aria-label={`${unreadCount} unread notifications`}>
              <Bell size={19} />{unreadCount > 0 && <span>{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </Link>
          )}
          {!isLoading && (isAuthenticated ? (
            <div className="account-menu">
              <button className="account-trigger" onClick={() => setAccountOpen((value) => !value)} aria-expanded={accountOpen}>
                <span className="avatar">{displayName.slice(0, 1).toUpperCase()}</span>
                <span className="account-copy"><small>Welcome back</small><strong>{displayName}</strong></span>
                <ChevronDown size={16} />
              </button>
              {accountOpen && <div className="account-popover">
                <Link href="/profile" onClick={() => setAccountOpen(false)}><UserRound size={17} /> Profile</Link>
                <Link href="/bookings" onClick={() => setAccountOpen(false)}><Ticket size={17} /> My bookings</Link>
                <button onClick={() => void signOut()}><LogIn size={17} /> Sign out</button>
              </div>}
            </div>
          ) : (
            <><button className="button button-ghost desktop-login" onClick={() => void signIn(pathname)}>Sign in</button><Link className="button button-primary" href="/register">Create account</Link></>
          ))}
          <button className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  );
}
