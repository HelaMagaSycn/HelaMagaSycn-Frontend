import { Suspense } from "react";
import { SearchResults } from "@/app/search/search-results";

export const metadata = { title: "Search trains" };

export default function SearchPage() {
  return <Suspense fallback={<main className="centered-page"><div className="loading-card"><div className="loading-bar" /></div></main>}><SearchResults /></Suspense>;
}
