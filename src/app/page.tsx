import { ArrowRight, Armchair, BadgeCheck, Clock3, Map, ShieldCheck, Sparkles, TrainFront, WalletCards } from "lucide-react";
import Link from "next/link";
import { SearchForm } from "@/components/search-form";

export default function Home() {
  return <main>
    <section className="hero"><div className="page-shell hero-shell"><div className="hero-copy"><span className="eyebrow"><Sparkles size={15} /> A better way across Sri Lanka</span><h1>Your journey.<br /><em>Your seat.</em> Every segment.</h1><p>See live reserved-seat availability and pay only for the part of the railway you actually travel.</p><div className="hero-trust"><span><BadgeCheck size={18} /> Secure booking</span><span><Clock3 size={18} /> Live availability</span><span><WalletCards size={18} /> Fair segment fares</span></div></div><div className="hero-art" aria-hidden="true"><div className="sun-orb" /><div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="rail-line" /><div className="art-train"><TrainFront /></div><div className="route-pin route-pin-one">Kandy</div><div className="route-pin route-pin-two">Ella</div></div></div>
      <div className="page-shell hero-search-wrap"><SearchForm /></div>
    </section>

    <section className="confidence-strip"><div className="page-shell"><span>One seat, more journeys</span><strong>Real-time inventory</strong><strong>Transparent LKR pricing</strong><strong>Digital booking status</strong></div></section>

    <section className="section page-shell"><div className="section-heading"><div><span className="eyebrow">Built around your journey</span><h2>Rail booking that feels effortless</h2></div><p>From searching the line to watching your booking confirm, every step is clear, responsive, and secure.</p></div><div className="feature-grid">
      <article><span className="feature-icon"><Map /></span><small>01</small><h3>Search your exact leg</h3><p>Choose any origin and destination on the line. We only show seats available for that specific segment.</p></article>
      <article><span className="feature-icon"><Armchair /></span><small>02</small><h3>Pick the seat you want</h3><p>Explore each coach visually, identify windows and aisle seats, and select with one click.</p></article>
      <article><span className="feature-icon"><ShieldCheck /></span><small>03</small><h3>Book with confidence</h3><p>Live status notifications tell you when the seat and payment are confirmed—or if action is needed.</p></article>
    </div></section>

    <section className="route-showcase"><div className="page-shell route-showcase-inner"><div><span className="eyebrow">The hill-country line</span><h2>From city rhythm to<br />mountain stillness.</h2><p>One connected route through some of Sri Lanka’s most memorable landscapes.</p><Link className="text-link" href="/?from=FOT&to=BAD">Explore the full route <ArrowRight size={17} /></Link></div><div className="route-track"><span className="track-line" />{[{code:"FOT",name:"Colombo Fort"},{code:"KDY",name:"Kandy"},{code:"NNA",name:"Nanu Oya"},{code:"ELL",name:"Ella"},{code:"BAD",name:"Badulla"}].map((stop,index)=><div className="track-stop" key={stop.code}><i className={index===0?"active":""} /><span><strong>{stop.name}</strong><small>{stop.code}</small></span></div>)}</div></div></section>

    <section className="section page-shell"><div className="cta-panel"><div><span className="eyebrow">Ready when you are</span><h2>Where will the railway take you?</h2><p>Search without an account. Sign in only when you are ready to reserve.</p></div><Link className="button button-light" href="#top">Plan my journey <ArrowRight size={18} /></Link></div></section>
  </main>;
}
