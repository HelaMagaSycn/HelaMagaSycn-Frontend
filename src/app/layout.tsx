import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "HelaMaga Sync | Smarter railway seat booking", template: "%s | HelaMaga Sync" },
  description: "Search live train seats, pay only for your journey segment, and book reserved rail travel across Sri Lanka.",
  icons: { icon: "/helamaga-symbol.png", apple: "/helamaga-symbol.png" },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProviders><Header /><div className="app-content">{children}</div><Footer /></AppProviders></body></html>;
}
