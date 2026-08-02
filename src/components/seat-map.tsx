"use client";

import clsx from "clsx";
import { Accessibility, Armchair, DoorOpen, Info, Luggage, Navigation, PanelTop } from "lucide-react";
import { useMemo, useState } from "react";
import { classLabel } from "@/lib/format";
import type { AvailableSeat, SeatAvailability } from "@/types/api";

interface SeatMapProps {
  availableSeats: AvailableSeat[];
  seatMap?: SeatAvailability[];
  selectedIds: string[];
  maximum: number;
  onChange: (seatIds: string[]) => void;
}

function numericSeat(value: string) {
  const number = Number.parseInt(value.replace(/\D/g, ""), 10);
  return Number.isNaN(number) ? 9999 : number;
}

export function SeatMap({ availableSeats, seatMap, selectedIds, maximum, onChange }: SeatMapProps) {
  const normalized = useMemo<SeatAvailability[]>(() => {
    if (seatMap?.length) return seatMap;
    return availableSeats.map((seat) => ({ ...seat, available: true }));
  }, [availableSeats, seatMap]);
  const coaches = useMemo(() => [...new Set(normalized.map((seat) => seat.coachCode))].sort(), [normalized]);
  const [requestedCoach, setRequestedCoach] = useState("");
  const activeCoach = coaches.includes(requestedCoach) ? requestedCoach : (coaches[0] ?? "");
  const seats = normalized.filter((seat) => seat.coachCode === activeCoach).sort((a, b) => numericSeat(a.seatNumber) - numericSeat(b.seatNumber));
  const rows = Array.from({ length: Math.ceil(seats.length / 4) }, (_, index) => seats.slice(index * 4, index * 4 + 4));

  const toggle = (seat: SeatAvailability) => {
    if (!seat.available) return;
    if (selectedIds.includes(seat.seatId)) return onChange(selectedIds.filter((id) => id !== seat.seatId));
    if (selectedIds.length >= maximum) return;
    onChange([...selectedIds, seat.seatId]);
  };

  return <section className="seat-map-card" aria-labelledby="seat-map-title">
    <div className="seat-map-header"><div><span className="eyebrow">Live coach map</span><h2 id="seat-map-title">Choose your seat</h2><p>Window positions and aisle orientation are shown on the map.</p></div><span className="selection-counter"><strong>{selectedIds.length}</strong> of {maximum} selected</span></div>
    <div className="coach-tabs" role="tablist" aria-label="Train coaches">{coaches.map((coach) => { const count = normalized.filter((seat) => seat.coachCode === coach && seat.available).length; return <button key={coach} role="tab" aria-selected={activeCoach === coach} className={activeCoach === coach ? "active" : ""} onClick={() => setRequestedCoach(coach)}><span>Coach {coach}</span><small>{count} free</small></button>; })}</div>
    {seats.length ? <div className="coach-shell">
      <div className="coach-front"><Navigation size={18} /><span>Direction of travel</span><div><Luggage size={18} /> Luggage</div></div>
      <div className="window-rail window-left"><PanelTop size={17} /><span>WINDOW</span><PanelTop size={17} /></div>
      <div className="window-rail window-right"><PanelTop size={17} /><span>WINDOW</span><PanelTop size={17} /></div>
      <div className="seat-grid"><div className="seat-side-labels"><span>A</span><span>B</span><span className="aisle-label">AISLE</span><span>C</span><span>D</span></div>
        {rows.map((row, rowIndex) => <div className="seat-row" key={rowIndex}><small>{rowIndex + 1}</small>{[0,1,2,3].map((position) => { const seat = row[position]; if (!seat) return <span className="seat-placeholder" key={position} />; const selected = selectedIds.includes(seat.seatId); const windowSeat = position === 0 || position === 3; return <button key={seat.seatId} className={clsx("seat", selected && "seat-selected", !seat.available && "seat-unavailable")} disabled={!seat.available} onClick={() => toggle(seat)} aria-pressed={selected} aria-label={`${seat.available ? "Available" : "Unavailable"} seat ${seat.seatNumber}, ${windowSeat ? "window" : "aisle"}, ${classLabel(seat.travelClass)}`}><Armchair size={19} /><strong>{seat.seatNumber}</strong>{windowSeat && <span className="seat-detail">W</span>}</button>; })}</div>)}
      </div>
      <div className="coach-rear"><DoorOpen size={18} /><span>Coach entrance</span><div><Accessibility size={18} /> Priority area</div></div>
    </div> : <div className="seat-map-empty"><Info size={22} /><p>No seats are available in this coach for the selected leg.</p></div>}
    <div className="seat-legend"><span><i className="legend-seat available" />Available</span><span><i className="legend-seat selected" />Selected</span><span><i className="legend-seat unavailable" />Unavailable</span><span><strong>W</strong> Window seat</span></div>
  </section>;
}
