import { Headphones, LockKeyhole, TrainFront } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";

export function Footer() {
  return <footer className="site-footer"><div className="footer-main page-shell">
    <div className="footer-brand"><Brand /><p>Thoughtful rail travel, with every segment working harder for Sri Lanka.</p></div>
    <div><strong>Travel</strong><Link href="/">Search trains</Link><Link href="/bookings">Manage booking</Link><Link href="/help">Travel help</Link></div>
    <div><strong>Trust</strong><span><LockKeyhole size={15} /> Secure checkout</span><span><TrainFront size={15} /> Live seat inventory</span><span><Headphones size={15} /> Passenger support</span></div>
  </div><div className="footer-bottom page-shell"><span>© {new Date().getFullYear()} HelaMaga Sync</span><span>Segment-based railway seat booking</span></div></footer>;
}
