import { Suspense } from "react";
import { SeatSelectionPage } from "@/app/trips/[tripId]/seats/seat-selection";
export const metadata = { title: "Choose seats" };
export default function SeatsPage() { return <Suspense fallback={<main className="centered-page"><div className="loading-card"><div className="loading-bar" /></div></main>}><SeatSelectionPage /></Suspense>; }
