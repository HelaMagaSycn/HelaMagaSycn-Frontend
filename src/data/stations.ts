import type { StationOption } from "@/types/api";

export const FALLBACK_STATIONS: StationOption[] = [
  { code: "FOT", name: "Colombo Fort" },
  { code: "MDA", name: "Maradana" },
  { code: "RGM", name: "Ragama" },
  { code: "GMP", name: "Gampaha" },
  { code: "KDY", name: "Kandy" },
  { code: "NNA", name: "Nanu Oya" },
  { code: "ELL", name: "Ella" },
  { code: "BAD", name: "Badulla" },
];

export function stationName(code: string | null | undefined) {
  if (!code) return "Unknown station";
  return FALLBACK_STATIONS.find((station) => station.code === code)?.name ?? code;
}
