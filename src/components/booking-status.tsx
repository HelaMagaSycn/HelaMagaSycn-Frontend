import { CheckCircle2, CircleDashed, Clock3, RotateCcw, XCircle } from "lucide-react";
import { titleCase } from "@/lib/format";
import type { BookingStatus } from "@/types/api";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const success = status === "CONFIRMED";
  const failed = ["SEAT_UNAVAILABLE", "PAYMENT_FAILED", "HOLD_EXPIRED", "FAILED"].includes(status);
  const refund = ["REFUND_PENDING", "REFUNDED"].includes(status);
  const Icon = success ? CheckCircle2 : failed ? XCircle : refund ? RotateCcw : status === "PENDING" ? Clock3 : CircleDashed;
  return <span className={`status-badge ${success ? "status-success" : failed ? "status-error" : refund ? "status-refund" : "status-progress"}`}><Icon size={15} />{titleCase(status)}</span>;
}
