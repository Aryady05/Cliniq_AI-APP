import { useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { SectionHeader } from "./components/layout/SectionHeader";
import { MetricCard } from "./components/dashboard/MetricCard";
import { metrics, queuePatients } from "./data/mock";
import { PatientQueue } from "./components/dashboard/PatientQueue";
import { SymptomChecker } from "./components/intake/SymptomChecker";
import { TranscriptPanel } from "./components/consultation/TranscriptPanel";
import { ClinicalNotesPreview } from "./components/dashboard/ClinicalNotesPreview";
import { CarePathways } from "./components/care/CarePathways";
import { FeatureTimeline } from "./components/dashboard/FeatureTimeline";
import type { BackendNoteDraft, IntakeSummary, QueuePatient } from "./types/clinical";

function App() {
  const [recentIntakes, setRecentIntakes] = useState<IntakeSummary[]>([]);
  const [latestDraft, setLatestDraft] = useState<BackendNoteDraft | null>(null);

  const queue: QueuePatient[] = [
    ...recentIntakes.map((intake, index) => ({
      id: intake.patientLabel,
      name: intake.name,
      age: intake.age,
      concern: intake.concern,
      waitTime: index === 0 ? "Just now" : `${index + 1} min`,
      triageScore: intake.triageScore,
      urgency: intake.urgency,
      route: intake.route
    })),
    ...queuePatients
  ]
    .sort((left, right) => right.triageScore - left.triageScore)
    .slice(0, 6);

  return (
    <AppShell
      title="Triage and Clinical Documentation Frontend"
    >
      <main className="space-y-6 pb-8">
        <section id="overview" className="grid gap-4">
          <div className="grid min-h-[320px] gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="flex justify-start lg:justify-center">
              <div className="max-w-4xl">
                <h2 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                  Accelerate patient triage and streamline clinical documentation.
                </h2>
                <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-700">
                  Capture consultations, structure clinical notes, and generate reports automatically.
                </p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="/doctor-thumb.png"
                alt="Doctor giving a thumbs up"
                className="w-full max-w-[380px] object-contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </section>

        <FeatureTimeline />

        <section id="intake">
          <SectionHeader
            eyebrow="Intake"
            title="Point-of-entry screening"
            description="The first screen helps front-desk staff or patients report symptoms quickly while the interface continuously calculates urgency."
          />
          <SymptomChecker
            onIntakeCreated={(intake) =>
              setRecentIntakes((current) => [
                intake,
                ...current.filter((item) => item.patientId !== intake.patientId)
              ])
            }
          />
        </section>

        <section id="queue">
          <SectionHeader
            eyebrow="Visibility"
            title="Queue board that keeps high-risk patients visible"
            description="Urgent patients remain impossible to miss, with triage score, wait time, and next-step routing visible at a glance."
          />
          <PatientQueue patients={queue} />
        </section>

        <section id="consultation">
          <SectionHeader
            eyebrow="Consultation"
            title="Doctor workspace for transcript-to-note generation"
            description="Consultation capture, structured extraction, and clinician review are bundled into one clean interface."
          />
          <div className="grid gap-6">
            <TranscriptPanel
              activeIntake={recentIntakes[0] ?? null}
              onNotesGenerated={setLatestDraft}
            />
            <ClinicalNotesPreview draft={latestDraft} />
          </div>
        </section>

        <section id="routing">
          <SectionHeader
            eyebrow="Routing"
            title="Care pathways after urgency is known"
            description="The frontend shows how the product can move patients into emergency, specialty, or remote pathways instead of ending at triage."
          />
          <CarePathways />
        </section>
      </main>
    </AppShell>
  );
}

export default App;
