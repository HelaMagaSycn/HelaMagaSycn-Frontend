import { ArrowRight, Armchair, Clock3, Gauge, Leaf, TrainFront } from "lucide-react";
import Link from "next/link";
import { stationName } from "@/data/stations";
import { formatJourneyDate, formatJourneyTime, formatMoney } from "@/lib/format";
import type { JourneySearchResult } from "@/types/api";

export function TrainCard({ journey, originCode, destinationCode, travelDate, passengers }: { journey: JourneySearchResult; originCode: string; destinationCode: string; travelDate: string; passengers: number }) {
  const query = new URLSearchParams({
    originCode,
    destinationCode,
    originStationId: journey.originStationId,
    destinationStationId: journey.destinationStationId,
    trainNumber: journey.trainNumber,
    departureTime: journey.departureTime,
    fare: String(journey.fare),
    currency: journey.currency,
    passengers: String(passengers),
    travelDate,
  });
  const seatCount = journey.availableSeats.length;
  return <article className="train-card">
    <div className="train-card-top"><div className="train-identity"><span className="train-icon"><TrainFront size={24} /></span><div><small>Express service</small><h2>{journey.trainNumber.replaceAll("-", " ")}</h2><span>{formatJourneyDate(journey.departureTime)}</span></div></div><span className="live-pill"><i /> Live inventory</span></div>
    <div className="train-timeline"><div><strong>{formatJourneyTime(journey.departureTime)}</strong><span>{stationName(originCode)}</span><small>{originCode}</small></div><div className="route-line"><span /><small>Reserved service</small><ArrowRight size={17} /></div><div className="destination-time"><strong>Scheduled</strong><span>{stationName(destinationCode)}</span><small>{destinationCode}</small></div></div>
    <div className="train-meta"><span><Clock3 size={16} /> Departure confirmed</span><span><Gauge size={16} /> Segment fare</span><span><Leaf size={16} /> Lower-emission travel</span></div>
    <div className="train-card-bottom"><div className="availability-copy"><Armchair size={18} /><span><strong>{seatCount}</strong> seats available for this leg</span></div><div className="fare-copy"><small>From, per passenger</small><strong>{formatMoney(journey.fare, journey.currency)}</strong></div><Link className="button button-primary" href={`/trips/${journey.tripId}/seats?${query}`}>Choose seats <ArrowRight size={17} /></Link></div>
  </article>;
}
