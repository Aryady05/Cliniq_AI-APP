import { ArrowRight, TimerReset } from "lucide-react";
import { queuePatients } from "../../data/mock";
import type { QueuePatient } from "../../types/clinical";
import { UrgencyBadge } from "./UrgencyBadge";

type PatientQueueProps = {
  patients?: QueuePatient[];
};

export function PatientQueue({ patients = queuePatients }: PatientQueueProps) {
  return (
    <section className="glass-panel rounded-[28px] p-5 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Queue visibility</h3>
          <p className="text-sm text-slate-600">
            The sickest patients stay pinned at the top with route recommendations.
          </p>
        </div>
        <button className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100">
          Open full board
        </button>
      </div>

      <div className="space-y-3">
        {patients.map((patient) => (
          <article
            key={patient.id}
            className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <UrgencyBadge level={patient.urgency} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{patient.name}</p>
                    <span className="text-sm text-slate-500">{patient.age} yrs</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {patient.id}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{patient.concern}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Triage score
                  </p>
                  <p className="text-2xl font-semibold">{patient.triageScore}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="mb-1 flex items-center gap-2 font-medium">
                    <TimerReset className="h-4 w-4 text-cyan-700" />
                    Waiting {patient.waitTime}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <ArrowRight className="h-4 w-4 text-cyan-700" />
                    {patient.route}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
