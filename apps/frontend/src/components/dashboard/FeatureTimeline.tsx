import {
  ClipboardCheck,
  FileOutput,
  MessagesSquare,
  Siren,
  Workflow
} from "lucide-react";

const steps = [
  {
    title: "Patient self-entry",
    icon: ClipboardCheck
  },
  {
    title: "Urgency engine",
    icon: Siren
  },
  {
    title: "Doctor consultation",
    icon: MessagesSquare
  },
  {
    title: "Care routing",
    icon: Workflow
  },
  {
    title: "Report export",
    icon: FileOutput
  }
];

export function FeatureTimeline() {
  return (
    <section className="glass-panel rounded-[28px] p-5 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Product flow</h3>
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLastStep = index === steps.length - 1;

          return (
            <article key={step.title} className="relative flex items-center gap-3 lg:block">
              {!isLastStep ? (
                <div className="absolute left-[52px] top-7 hidden h-px w-[calc(100%-28px)] bg-slate-200 lg:block" />
              ) : null}

              <div className="relative z-10 flex items-center gap-3 rounded-[22px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)] lg:min-h-[120px] lg:flex-col lg:items-start lg:justify-between">
                <div className="flex items-center gap-3 lg:w-full lg:justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    0{index + 1}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 lg:max-w-[10rem]">
                  {step.title}
                </h4>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
