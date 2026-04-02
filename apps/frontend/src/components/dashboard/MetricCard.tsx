import type { Metric } from "../../types/clinical";

export function MetricCard({ label, value, change }: Metric) {
  return (
    <article className="glass-panel flex h-full min-h-[140px] flex-col justify-between rounded-[20px] p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
      <div className="text-4xl font-semibold tracking-tight text-slate-950">{value}</div>
      <div className="mt-6 space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <div className="text-[11px] font-medium text-slate-500">
          {change}
        </div>
      </div>
    </article>
  );
}
