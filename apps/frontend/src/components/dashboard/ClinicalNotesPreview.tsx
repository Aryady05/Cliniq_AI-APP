import { BarChart3, FileText } from "lucide-react";
import type { BackendNoteDraft } from "../../types/clinical";

type ClinicalNotesPreviewProps = {
  draft?: BackendNoteDraft | null;
};

type NoteMetric = {
  label: string;
  value: number;
  tone: string;
};

function getDraftMetrics(draft?: BackendNoteDraft | null): NoteMetric[] {
  const fallback = [
    { label: "Symptoms", value: 84, tone: "bg-cyan-600" },
    { label: "Diagnosis", value: 76, tone: "bg-sky-600" },
    { label: "Prescription", value: 68, tone: "bg-emerald-600" },
    { label: "Notes", value: 72, tone: "bg-slate-700" },
    { label: "Follow up", value: 58, tone: "bg-amber-500" }
  ];

  if (!draft) {
    return fallback;
  }

  const toScore = (count: number, max = 4) => Math.min(100, 30 + count * Math.round(70 / max));

  return [
    { label: "Symptoms", value: toScore(draft.symptoms.length, 4), tone: "bg-cyan-600" },
    { label: "Diagnosis", value: toScore(draft.diagnosis.length, 3), tone: "bg-sky-600" },
    {
      label: "Prescription",
      value: toScore(draft.prescription.length, 3),
      tone: "bg-emerald-600"
    },
    { label: "Notes", value: toScore(draft.notes.length, 3), tone: "bg-slate-700" },
    { label: "Follow up", value: toScore(draft.follow_up.length, 2), tone: "bg-amber-500" }
  ];
}

export function ClinicalNotesPreview({ draft }: ClinicalNotesPreviewProps) {
  const metrics = getDraftMetrics(draft);
  const averageScore = Math.round(
    metrics.reduce((total, metric) => total + metric.value, 0) / metrics.length
  );

  return (
    <section className="glass-panel rounded-[28px] p-5 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Structured note completion</h3>
          <p className="text-sm text-slate-600">
            Live note sections visualized as extraction and completeness bars.
          </p>
        </div>
        <div className="rounded-[18px] border border-slate-200/80 bg-white px-4 py-3 text-right shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Avg completion
          </p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">{averageScore}%</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-50 text-cyan-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Section coverage</h4>
              <p className="text-sm text-slate-500">Each bar reflects how complete the draft is.</p>
            </div>
          </div>

          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{metric.label}</span>
                  <span className="text-slate-500">{metric.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${metric.tone}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Draft status</h4>
              <p className="text-sm text-slate-500">Snapshot of clinician-ready sections.</p>
            </div>
          </div>

          <div className="space-y-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between rounded-[18px] bg-slate-50 px-3 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{metric.label}</span>
                <span className="text-sm font-semibold text-slate-950">
                  {metric.value >= 75 ? "Ready" : metric.value >= 60 ? "Review" : "Needs input"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
