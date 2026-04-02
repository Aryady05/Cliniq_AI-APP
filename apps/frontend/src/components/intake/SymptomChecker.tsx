import { AlertTriangle, ArrowRight, HeartPulse, Mic2 } from "lucide-react";
import { useState } from "react";
import { symptomQuestions } from "../../data/mock";
import type { IntakeSummary } from "../../types/clinical";
import { apiRequest } from "../../utils/api";
import { cn } from "../../utils/cn";

type SymptomCheckerProps = {
  onIntakeCreated: (intake: IntakeSummary) => void;
};

type TriageResponse = {
  urgency: IntakeSummary["urgency"];
  triage_score: number;
  recommended_route: string;
  rationale: string[];
};

type IntakeResponse = {
  patient_id: string;
  triage: TriageResponse;
  notes?: string | null;
};

type PatientResponse = {
  id: string;
};

const optionSelections: Record<string, string> = {
  "symptom-onset": "Within 1 hour",
  breathing: "Severe",
  pain: "8-10 severe",
  "red-flags": "Confusion"
};

export function SymptomChecker({ onIntakeCreated }: SymptomCheckerProps) {
  const [fullName, setFullName] = useState("Nandita Rao");
  const [age, setAge] = useState("62");
  const [complaint, setComplaint] = useState(
    "Chest tightness, dizziness on climbing stairs, mild shortness of breath."
  );
  const [selectedOptions, setSelectedOptions] = useState(optionSelections);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestIntake, setLatestIntake] = useState<IntakeSummary | null>(null);

  const selectedBreathing = selectedOptions.breathing;
  const selectedPain = selectedOptions.pain;
  const selectedRedFlag = selectedOptions["red-flags"];
  const previewUrgency =
    latestIntake?.urgency ??
    (selectedBreathing === "Severe" || selectedPain === "8-10 severe" || selectedRedFlag !== "None observed"
      ? "high"
      : "moderate");
  const previewRationale = latestIntake
    ? latestIntake.rationale.join(" ")
    : `Onset: ${selectedOptions["symptom-onset"]}. Breathing: ${selectedBreathing}. Pain: ${selectedPain}. Red flags: ${selectedRedFlag}.`;

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);

    try {
      const [firstName, ...rest] = fullName.trim().split(/\s+/);
      const lastName = rest.join(" ") || "Patient";
      const normalizedAge = Number(age);
      const symptoms = complaint
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const redFlags =
        selectedOptions["red-flags"] === "None observed"
          ? []
          : [selectedOptions["red-flags"].toLowerCase()];

      if (selectedBreathing !== "No") {
        symptoms.push(`${selectedBreathing.toLowerCase()} breathing difficulty`);
      }

      if (selectedPain !== "0-3 mild") {
        symptoms.push(`${selectedPain} pain`);
      }

      const patient = await apiRequest<PatientResponse>("/patients", {
        method: "POST",
        body: {
          first_name: firstName || "Unknown",
          last_name: lastName,
          age: normalizedAge,
          gender: "unspecified"
        }
      });

      const intake = await apiRequest<IntakeResponse>("/intake/assess", {
        method: "POST",
        body: {
          patient_id: patient.id,
          chief_complaint: complaint,
          symptoms,
          red_flags: redFlags,
          symptom_onset: selectedOptions["symptom-onset"],
          notes: `Captured from the frontend intake form. Breathing: ${selectedBreathing}. Pain: ${selectedPain}. Red flags: ${selectedRedFlag}.`,
          vitals: {
            systolic_bp: 154,
            diastolic_bp: 96,
            pulse: 108,
            spo2: 93
          }
        }
      });

      const summary: IntakeSummary = {
        patientId: patient.id,
        patientLabel: `PT-${patient.id.slice(0, 6).toUpperCase()}`,
        name: fullName,
        age: normalizedAge,
        concern: complaint,
        triageScore: intake.triage.triage_score,
        urgency: intake.triage.urgency,
        route: intake.triage.recommended_route,
        rationale: intake.triage.rationale,
        notes: intake.notes
      };

      setLatestIntake(summary);
      onIntakeCreated(summary);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to create intake."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="glass-panel rounded-[28px] p-5 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-900">Point-of-entry symptom intake</h3>
        <p className="text-sm text-slate-600">
          Designed for front desk staff, kiosk entry, or a patient&apos;s own phone before triage.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input
                className="input-shell"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                aria-label="Full name"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Age</span>
              <input
                className="input-shell"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                aria-label="Age"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Main complaint</span>
              <textarea
                className="input-shell min-h-28 resize-none"
                value={complaint}
                onChange={(event) => setComplaint(event.target.value)}
                aria-label="Main complaint"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-3">
            {symptomQuestions.map((item) => (
              <div
                key={item.id}
                className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <p className="text-sm font-medium text-slate-800">{item.question}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setSelectedOptions((current) => ({
                          ...current,
                          [item.id]: option
                        }))
                      }
                      aria-pressed={selectedOptions[item.id] === option}
                      className={cn(
                        "rounded-full px-3 py-2 text-sm transition",
                        selectedOptions[item.id] === option
                          ? "bg-cyan-700 text-white shadow-[0_4px_12px_rgba(8,145,178,0.16)]"
                          : "bg-white text-slate-700 hover:bg-cyan-50"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[24px] bg-slate-950 p-5 text-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-300">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Live urgency</p>
                <h4 className="text-2xl font-semibold">{`${previewUrgency} risk`}</h4>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/6 p-3">
                <p className="text-slate-400">Triage score</p>
                <p className="mt-1 text-3xl font-semibold">
                  {latestIntake?.triageScore ?? "--"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/6 p-3">
                <p className="text-slate-400">Route</p>
                <p className="mt-1 font-medium">{latestIntake?.route ?? "Pending"}</p>
              </div>
            </div>
            <div
              className={cn(
                "mt-4 rounded-2xl p-3 text-sm leading-6",
                latestIntake ? "bg-rose-500/10 text-rose-100" : "bg-white/8 text-slate-300"
              )}
            >
              {previewRationale}
            </div>
          </div>

          <div className="rounded-[24px] border border-cyan-100 bg-cyan-50/90 p-5">
            <div className="mb-3 flex items-center gap-3 text-cyan-900">
              <HeartPulse className="h-5 w-5" />
              <h4 className="font-semibold">Vitals placeholder</h4>
            </div>
            <div className="space-y-2 text-sm text-cyan-950/80">
              <div className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2">
                <span>Blood pressure</span>
                <span className="font-medium">154 / 96</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2">
                <span>Pulse</span>
                <span className="font-medium">108 bpm</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2">
                <span>SpO2</span>
                <span className="font-medium">93%</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-cyan-700 px-5 py-4 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(8,145,178,0.16)] transition hover:-translate-y-0.5 hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting intake..." : "Continue to doctor handoff"}
            <ArrowRight className="h-4 w-4" />
          </button>
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}

          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4">
            <div className="mb-2 flex items-center gap-3 text-slate-900">
              <Mic2 className="h-5 w-5 text-cyan-700" />
              <h4 className="font-semibold">Voice-ready intake</h4>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              The final version can support voice symptom capture in English, Hindi, and regional
              languages for faster front-desk throughput.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
