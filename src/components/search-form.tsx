"use client";

import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { ArrowRight, ArrowUpDown, CalendarDays, MapPin, Search, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FALLBACK_STATIONS } from "@/data/stations";
import { api } from "@/lib/api";

interface Props { compact?: boolean; initialOrigin?: string; initialDestination?: string; initialDate?: string }

export function SearchForm({ compact = false, initialOrigin = "FOT", initialDestination = "KDY", initialDate }: Props) {
  const router = useRouter();
  const today = format(new Date(), "yyyy-MM-dd");
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate ?? format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [passengers, setPassengers] = useState(1);
  const stationQuery = useQuery({ queryKey: ["stations"], queryFn: api.stations, retry: 1 });
  const stations = stationQuery.data?.length ? stationQuery.data : FALLBACK_STATIONS;
  const invalid = origin === destination;
  const destinationOptions = useMemo(() => stations.filter((station) => station.code !== origin), [origin, stations]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (invalid) return;
    const query = new URLSearchParams({ from: origin, to: destination, date, passengers: String(passengers) });
    router.push(`/search?${query}`);
  };

  return <form className={`journey-search ${compact ? "journey-search-compact" : ""}`} onSubmit={submit}>
    <div className="search-field"><label htmlFor={`origin-${compact}`}>From</label><div><MapPin size={19} /><select id={`origin-${compact}`} value={origin} onChange={(event) => setOrigin(event.target.value)}>{stations.map((station) => <option key={station.code} value={station.code}>{station.name}</option>)}</select></div><small>{origin} station</small></div>
    <button type="button" className="swap-button" onClick={() => { setOrigin(destination); setDestination(origin); }} aria-label="Swap origin and destination"><ArrowUpDown size={18} /></button>
    <div className="search-field"><label htmlFor={`destination-${compact}`}>To</label><div><ArrowRight size={19} /><select id={`destination-${compact}`} value={destination} onChange={(event) => setDestination(event.target.value)}>{destinationOptions.map((station) => <option key={station.code} value={station.code}>{station.name}</option>)}</select></div><small>{destination} station</small></div>
    <div className="search-field"><label htmlFor={`date-${compact}`}>Travel date</label><div><CalendarDays size={19} /><input id={`date-${compact}`} type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} /></div><small>Local departure date</small></div>
    <div className="search-field passenger-field"><label htmlFor={`passengers-${compact}`}>Passengers</label><div><UsersRound size={19} /><select id={`passengers-${compact}`} value={passengers} onChange={(event) => setPassengers(Number(event.target.value))}>{[1,2,3,4,5,6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "adult" : "adults"}</option>)}</select></div><small>Reserved seats</small></div>
    <button className="button button-primary search-submit" type="submit" disabled={invalid}><Search size={18} />Search trains</button>
    {invalid && <p className="form-error">Origin and destination must be different.</p>}
  </form>;
}
