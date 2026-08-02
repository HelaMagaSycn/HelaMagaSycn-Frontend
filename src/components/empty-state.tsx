import { SearchX } from "lucide-react";

export function EmptyState({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return <div className="empty-state"><span><SearchX size={28} /></span><h2>{title}</h2><p>{message}</p>{action}</div>;
}
