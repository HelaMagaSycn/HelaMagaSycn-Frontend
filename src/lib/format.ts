import { format } from "date-fns";

export function formatMoney(amount: number | null | undefined, currency = "LKR") {
  if (amount == null) return "Pending";
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatJourneyDate(value: string) {
  return format(new Date(value), "EEE, d MMM yyyy");
}

export function formatJourneyTime(value: string) {
  return format(new Date(value), "h:mm a");
}

export function titleCase(value: string) {
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function classLabel(value: string) {
  return `${titleCase(value)} class`;
}
