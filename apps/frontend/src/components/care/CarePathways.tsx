import { ArrowRightLeft, Route } from "lucide-react";

const pathwayDistribution = [
  { label: "Emergency", count: 11, share: 38, tone: "bg-rose-500" },
  { label: "Specialist", count: 9, share: 28, tone: "bg-cyan-600" },
  { label: "Teleconsult", count: 6, share: 18, tone: "bg-emerald-600" },
  { label: "Primary care", count: 5, share: 16, tone: "bg-amber-500" }
];

const capacity = [
  { label: "ER command desk", eta: "< 3 min", load: 72 },
  { label: "Cardiology intake", eta: "6 min", load: 54 },
  { label: "Telehealth queue", eta: "Same day", load: 31 }
];

export function CarePathways() {
  return (
    <section className="glass-panel rounded-[28px] p-5 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Routing distribution</h3>
          <p className="text-sm text-slate-600">
            Where patients are being routed after acuity is assessed.
          </p>
        </div>
        <div className="rounded-[18px] border border-slate-200/80 bg-white px-4 py-3 text-right shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Total routed
          </p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">31</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-50 text-cyan-700">
              <Route className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Pathway mix</h4>
              <p className="text-sm text-slate-500">Current destination split by patient volume.</p>
            </div>
          </div>

          <div className="space-y-4">
            {pathwayDistribution.map((pathway) => (
              <div key={pathway.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${pathway.tone}`} />
                    <span className="font-medium text-slate-700">{pathway.label}</span>
                  </div>
                  <span className="text-slate-500">
                    {pathway.count} patients · {pathway.share}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${pathway.tone}`}
                    style={{ width: `${pathway.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Capacity snapshot</h4>
              <p className="text-sm text-slate-500">Operational load and ETA by destination.</p>
            </div>
          </div>

          <div className="space-y-4">
            {capacity.map((item) => (
              <div key={item.label} className="rounded-[18px] bg-slate-50 px-3 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <span className="text-sm font-semibold text-cyan-800">{item.eta}</span>
                </div>
                <div className="h-2 rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-slate-700"
                    style={{ width: `${item.load}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
