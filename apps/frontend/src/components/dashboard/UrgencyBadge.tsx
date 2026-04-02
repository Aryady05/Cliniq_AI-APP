import type { UrgencyLevel } from "../../types/clinical";
import { cn } from "../../utils/cn";

const labelMap: Record<UrgencyLevel, string> = {
  critical: "Critical",
  high: "High",
  moderate: "Moderate",
  low: "Low"
};

const toneMap: Record<UrgencyLevel, string> = {
  critical: "text-rose-700",
  high: "text-amber-700",
  moderate: "text-sky-700",
  low: "text-emerald-700"
};

export function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  return <span className={cn("text-xs font-semibold", toneMap[level])}>{labelMap[level]}</span>;
}
