"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Clock3, Info, ShieldCheck, TrainFront } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SeatMap } from "@/components/seat-map";
import { stationName } from "@/data/stations";
import { api } from "@/lib/api";
import { formatJourneyDate, formatJourneyTime, formatMoney } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";

export function SeatSelectionPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, signIn } = useAuth();
  const originCode = params.get("originCode") ?? "FOT";
  const destinationCode = params.get("destinationCode") ?? "KDY";
  const travelDate = params.get("travelDate") ?? new Date().toISOString().slice(0, 10);
  const passengerCount = Math.min(6, Math.max(1, Number(params.get("passengers") ?? "1")));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const journeyQuery = useQuery({ queryKey: ["journeys", originCode, destinationCode, travelDate], queryFn: () => api.searchJourneys(originCode, destinationCode, travelDate), refetchInterval: 15_000 });
  const journey = useMemo(() => journeyQuery.data?.find((item) => item.tripId === tripId), [journeyQuery.data, tripId]);
  const selectedSeats = journey?.availableSeats.filter((seat) => selectedIds.includes(seat.seatId)) ?? [];

  const continueBooking = async () => {
    if (!journey || selectedIds.length !== passengerCount) return;
    const query = new URLSearchParams({ tripId, seatIds: selectedIds.join(","), originStationId: journey.originStationId, destinationStationId: journey.destinationStationId, originCode, destinationCode, travelDate, trainNumber: journey.trainNumber, departureTime: journey.departureTime, fare: String(journey.fare), currency: journey.currency, coaches: selectedSeats.map((seat) => seat.coachCode).join(","), seatNumbers: selectedSeats.map((seat) => seat.seatNumber).join(","), passengers: String(passengerCount) });
    const target = `/checkout?${query}`;
    if (!isAuthenticated) return signIn(target);
    router.push(target);
  };

  if (journeyQuery.isLoading) return <main className="centered-page"><div className="loading-card"><h1>Opening the coach map</h1><div className="loading-bar" /></div></main>;
  if (!journey) return <main className="centered-page"><div className="not-found-card"><Info /><h1>This trip is no longer available.</h1><p>Return to search to refresh live services.</p><Link className="button button-primary" href={`/search?from=${originCode}&to=${destinationCode}&date=${travelDate}&passengers=${passengerCount}`}>Back to results</Link></div></main>;

  return <main className="booking-flow-page"><div className="page-shell"><div className="flow-nav"><Link className="back-link" href={`/search?from=${originCode}&to=${destinationCode}&date=${travelDate}&passengers=${passengerCount}`}><ArrowLeft size={16} />Back to trains</Link><div className="flow-steps"><span className="active"><i>1</i>Seats</span><b /><span><i>2</i>Details</span><b /><span><i>3</i>Confirmation</span></div></div>
    <section className="journey-summary-bar"><div className="summary-train"><span><TrainFront /></span><div><small>Selected service</small><strong>{journey.trainNumber.replaceAll("-", " ")}</strong></div></div><div className="summary-route"><div><strong>{formatJourneyTime(journey.departureTime)}</strong><span>{stationName(originCode)}</span></div><ArrowRight /><div><strong>Scheduled</strong><span>{stationName(destinationCode)}</span></div></div><div className="summary-date"><Clock3 /><div><small>Travel date</small><strong>{formatJourneyDate(journey.departureTime)}</strong></div></div></section>
    <div className="seat-layout"><SeatMap availableSeats={journey.availableSeats} seatMap={journey.seatMap} selectedIds={selectedIds} maximum={passengerCount} onChange={setSelectedIds} /><aside className="selection-panel"><span className="eyebrow">Your selection</span><h2>Journey summary</h2><div className="selection-route"><span>{stationName(originCode)}</span><ArrowRight size={16} /><span>{stationName(destinationCode)}</span></div><div className="selection-list">{Array.from({length:passengerCount},(_,index)=>{const seat=selectedSeats[index];return <div key={index} className={seat?"filled":""}><span>{seat?<Check size={15}/>:index+1}</span><div><small>Passenger {index+1}</small><strong>{seat?`Coach ${seat.coachCode} · Seat ${seat.seatNumber}`:"Choose a seat"}</strong></div>{seat&&<small>{seat.travelClass}</small>}</div>})}</div><div className="price-breakdown"><span>Fare × {passengerCount}<strong>{formatMoney(journey.fare*passengerCount,journey.currency)}</strong></span><span>Booking fee<strong>Included</strong></span><div><span>Total</span><strong>{formatMoney(journey.fare*passengerCount,journey.currency)}</strong></div></div><button className="button button-primary button-block" disabled={selectedIds.length!==passengerCount} onClick={() => void continueBooking()}>{isAuthenticated?"Continue to details":"Sign in to book"}<ArrowRight size={17}/></button><p className="secure-note"><ShieldCheck size={16}/>Seats are rechecked and securely held at checkout.</p></aside></div>
  </div></main>;
}
