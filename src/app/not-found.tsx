import { ArrowLeft, TrainFront } from "lucide-react";
import Link from "next/link";
export default function NotFound() { return <main className="centered-page"><div className="not-found-card"><span><TrainFront /></span><small>404 · Wrong platform</small><h1>This journey isn’t on our timetable.</h1><p>The page may have moved, but your next train is still easy to find.</p><Link className="button button-primary" href="/"><ArrowLeft size={17} />Return home</Link></div></main>; }
