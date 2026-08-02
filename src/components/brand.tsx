import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="HelaMaga Sync home">
      <Image src="/helamaga-symbol.png" alt="" width={42} height={42} priority className="brand-symbol" />
      {!compact && <span><strong>හෙළමග</strong><small>SYNC</small></span>}
    </Link>
  );
}
