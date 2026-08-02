"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { SearchForm } from "@/components/search-form";
import { TrainCard } from "@/components/train-card";
import { stationName } from "@/data/stations";
import { api } from "@/lib/api";

export function SearchResults() {
  const params = useSearchParams();
  const origin = params.get("from") ?? "FOT";
  const destination = params.get("to") ?? "KDY";
  const travelDate = params.get("date") ?? new Date().toISOString().slice(0, 10);
  const passengers = Math.min(6, Math.max(1, Number(params.get("passengers") ?? "1")));
  const journeys = useQuery({
    queryKey: ["journeys", origin, destination, travelDate],
    queryFn: () => api.searchJourneys(origin, destination, travelDate),
    retry: 1,
  });

  return <main className="search-page"><section className="search-edit"><div className="page-shell"><Link className="back-link" href="/"><ArrowLeft size={16} />Back</Link><SearchForm compact initialOrigin={origin} initialDestination={destination} initialDate={travelDate} /></div></section>
    <section className="page-shell results-section"><div className="results-heading"><div><span className="eyebrow"><Sparkles size={15} /> Live journey results</span><h1>{stationName(origin)} <span>to</span> {stationName(destination)}</h1><p>{journeys.isLoading ? "Finding the best available seats…" : `${journeys.data?.length ?? 0} ${journeys.data?.length === 1 ? "service" : "services"} found · ${passengers} ${passengers === 1 ? "passenger" : "passengers"}`}</p></div><button className="button button-secondary" type="button"><SlidersHorizontal size={17} />Filters</button></div>
      {journeys.isLoading && <div className="train-list">{[1,2].map((item)=><div className="train-card skeleton-card" key={item}><div className="skeleton-line wide" /><div className="skeleton-route" /><div className="skeleton-line" /></div>)}</div>}
      {journeys.isError && <EmptyState title="We couldn’t load live trains" message="The search service may still be starting. Try again in a moment." action={<button className="button button-primary" onClick={() => void journeys.refetch()}><RefreshCw size={17} />Try again</button>} />}
      {journeys.data && journeys.data.length === 0 && <EmptyState title="No trains found for this journey" message="Try another date or choose a shorter section of the route." action={<Link className="button button-primary" href="/">Change search</Link>} />}
      {journeys.data && journeys.data.length > 0 && <div className="train-list">{journeys.data.map((journey) => <TrainCard key={journey.tripId} journey={journey} originCode={origin} destinationCode={destination} travelDate={travelDate} passengers={passengers} />)}</div>}
      <aside className="results-note"><strong>Why availability can change</strong><p>Seats are checked live when you search and locked again during booking. This prevents overlapping passengers from receiving the same seat.</p></aside>
    </section>
  </main>;
}
