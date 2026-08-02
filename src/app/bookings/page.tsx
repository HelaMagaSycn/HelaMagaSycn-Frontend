"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Plus, RefreshCw, Ticket } from "lucide-react";
import Link from "next/link";
import { BookingStatusBadge } from "@/components/booking-status";
import { EmptyState } from "@/components/empty-state";
import { ProtectedPage } from "@/components/protected-page";
import { api } from "@/lib/api";
import { formatJourneyDate, formatMoney } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";

export default function BookingsPage() {
  const { accessToken } = useAuth();
  const bookings=useQuery({queryKey:["bookings",accessToken],queryFn:()=>api.bookings(accessToken!),enabled:Boolean(accessToken),refetchInterval:5000});
  return <ProtectedPage><main className="account-page"><div className="page-shell"><div className="account-heading"><div><span className="eyebrow">Passenger account</span><h1>My bookings</h1><p>Every journey and its latest confirmation status, in one place.</p></div><Link className="button button-primary" href="/"><Plus size={17}/>Book another journey</Link></div>
    {bookings.isLoading&&<div className="booking-list">{[1,2].map(item=><div className="booking-row skeleton-card" key={item}/>)}</div>}
    {bookings.isError&&<EmptyState title="Bookings are unavailable" message="We couldn’t load your ticket history right now." action={<button className="button button-primary" onClick={()=>void bookings.refetch()}><RefreshCw/>Try again</button>}/>} 
    {bookings.data?.length===0&&<EmptyState title="Your first journey starts here" message="Search the railway, choose a live seat, and your booking will appear here." action={<Link className="button button-primary" href="/">Search trains</Link>}/>} 
    {bookings.data&&bookings.data.length>0&&<div className="booking-list">{bookings.data.map(booking=><Link className="booking-row" href={`/bookings/${booking.id}`} key={booking.id}><span className="booking-ticket-icon"><Ticket/></span><div className="booking-main"><small>Booking · {booking.id.slice(0,8).toUpperCase()}</small><strong>Reserved railway journey</strong><span><CalendarDays size={15}/>{formatJourneyDate(booking.createdAt)}</span></div><div className="booking-fare"><small>Total fare</small><strong>{formatMoney(booking.quotedAmount,booking.currency)}</strong></div><BookingStatusBadge status={booking.status}/><ArrowRight className="row-arrow"/></Link>)}</div>}
  </div></main></ProtectedPage>;
}
