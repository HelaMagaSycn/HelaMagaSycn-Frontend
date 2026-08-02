"use client";

import { Bell, BellRing, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { BookingStatusBadge } from "@/components/booking-status";
import { EmptyState } from "@/components/empty-state";
import { ProtectedPage } from "@/components/protected-page";
import { formatJourneyDate } from "@/lib/format";
import { useNotifications } from "@/providers/notification-provider";

export default function NotificationsPage(){const {notifications,unreadCount,markAllRead,clear}=useNotifications();const requestPermission=async()=>{if("Notification" in window)await Notification.requestPermission()};return <ProtectedPage><main className="account-page"><div className="page-shell"><div className="account-heading"><div><span className="eyebrow">Live booking updates</span><h1>Notifications</h1><p>{unreadCount?`${unreadCount} unread booking ${unreadCount===1?"update":"updates"}`:"You’re all caught up."}</p></div><div className="heading-actions"><button className="button button-secondary" onClick={()=>void requestPermission()}><BellRing/>Enable browser alerts</button><button className="button button-ghost" onClick={markAllRead}><CheckCheck/>Mark read</button><button className="icon-button danger" onClick={clear} aria-label="Clear notifications"><Trash2/></button></div></div>{notifications.length===0?<EmptyState title="No booking updates yet" message="Confirmation and failure notifications will appear here as your bookings progress." action={<Link className="button button-primary" href="/">Plan a journey</Link>}/>:<div className="notification-list">{notifications.map(item=><Link href={`/bookings/${item.bookingId}`} key={item.id} className={`notification-row ${item.read?"":"unread"}`}><span className="notification-icon"><Bell/></span><div><small>{formatJourneyDate(item.createdAt)}</small><strong>{item.title}</strong><p>{item.message}</p></div><BookingStatusBadge status={item.status}/></Link>)}</div>}</div></main></ProtectedPage>}
