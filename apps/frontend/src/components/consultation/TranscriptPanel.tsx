import { AudioLines, Download, Mic, MicOff, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { transcript } from "../../data/mock";
import type { BackendNoteDraft, IntakeSummary, TranscriptLine } from "../../types/clinical";
import { apiRequest } from "../../utils/api";
import { cn } from "../../utils/cn";

type TranscriptPanelProps = {
  activeIntake: IntakeSummary | null;
  transcriptLines?: TranscriptLine[];
  onNotesGenerated: (draft: BackendNoteDraft) => void;
};

type ConsultationResponse = {
  id: string;
};

type NoteResponse = {
  draft: BackendNoteDraft;
};

type ReportResponse = {
  report_id: string;
  file_path: string;
  status: string;
};

type TranscriptSpeaker = TranscriptLine["speaker"];

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: {
    transcript: string;
  };
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: SpeechRecognitionResultLike[];
};

type SpeechRecognitionErrorEventLike = Event & {
  error?: string;
  message?: string;
};

type SpeechRecognitionLike = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  const recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  return recognition ?? null;
}

function getCurrentTimeLabel() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

async function requestMicrophonePermission() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Your browser does not expose microphone access on this page.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
}

export function TranscriptPanel({
  activeIntake,
  transcriptLines = transcript,
  onNotesGenerated
}: TranscriptPanelProps) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [latestDraft, setLatestDraft] = useState<BackendNoteDraft | null>(null);
  const [reportDownloadUrl, setReportDownloadUrl] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<TranscriptLine[]>(transcriptLines);
  const [draftUtterance, setDraftUtterance] = useState("");
  const [activeSpeaker, setActiveSpeaker] = useState<TranscriptSpeaker>("Patient");
  const [generatedStats, setGeneratedStats] = useState({
    symptoms: 12,
    diagnoses: 3
  });

  useEffect(() => {
    setConsultationId(null);
    setLatestDraft(null);
    setReportDownloadUrl(null);
    setStatus(null);
    setError(null);
    setDraftUtterance("");
    setLiveTranscript(transcriptLines);
    setIsRecording(false);
  }, [activeIntake?.patientId]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function appendTranscriptLine(text: string) {
    const normalizedText = text.trim();
    if (!normalizedText) {
      return;
    }

    setLiveTranscript((current) => [
      ...current,
      {
        speaker: activeSpeaker,
        text: normalizedText,
        time: getCurrentTimeLabel()
      }
    ]);
  }

  async function handleMicToggle() {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setDraftUtterance("");
      setStatus("Microphone stopped.");
      return;
    }

    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setError("This browser does not support live speech recognition. Try Chrome or Edge.");
      return;
    }

    if (!window.isSecureContext) {
      setError("Microphone capture requires a secure context. Open the app on localhost or HTTPS.");
      return;
    }

    try {
      setError(null);
      setStatus("Requesting microphone permission...");
      await requestMicrophonePermission();
    } catch (permissionError) {
      setError(
        permissionError instanceof Error
          ? permissionError.message
          : "Microphone permission was denied."
      );
      setStatus(null);
      return;
    }

    setStatus("Listening for live transcript...");

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-IN";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcriptChunk = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalText += transcriptChunk;
        } else {
          interimText += transcriptChunk;
        }
      }

      if (finalText.trim()) {
        appendTranscriptLine(finalText);
      }

      setDraftUtterance(interimText.trim());
    };

    recognition.onerror = (event) => {
      const reason = event.error ?? event.message ?? "unknown-error";
      setError(`Microphone capture failed: ${reason}. Check browser mic permission and try again.`);
      setIsRecording(false);
      setDraftUtterance("");
      setStatus(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setDraftUtterance("");
      setStatus((current) => current ?? "Microphone stopped.");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsRecording(true);
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to start microphone capture."
      );
      setStatus(null);
      setIsRecording(false);
    }
  }

  async function handleGenerateSummary() {
    if (!activeIntake) {
      setError("Submit an intake first so the consultation can be linked to a patient.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setStatus(null);
    setReportDownloadUrl(null);

    try {
      const consultation = await apiRequest<ConsultationResponse>("/consultations", {
        method: "POST",
        body: {
          patient_id: activeIntake.patientId,
          clinician_id: "frontend-demo-clinician",
          department: "general medicine"
        }
      });

      for (const line of liveTranscript) {
        await apiRequest(`/consultations/${consultation.id}/transcript`, {
          method: "POST",
          body: {
            speaker: line.speaker.toLowerCase(),
            text: line.text,
            timestamp: new Date().toISOString()
          }
        });
      }

      const notes = await apiRequest<NoteResponse>("/notes/generate", {
        method: "POST",
        body: {
          patient_id: activeIntake.patientId,
          consultation_id: consultation.id,
          chief_complaint: activeIntake.concern,
          transcript: liveTranscript.map((line) => `${line.speaker}: ${line.text}`)
        }
      });

      setGeneratedStats({
        symptoms: notes.draft.symptoms.length,
        diagnoses: notes.draft.diagnosis.length
      });
      setConsultationId(consultation.id);
      setLatestDraft(notes.draft);
      setStatus("Summary generated from the backend transcript and ready for report export.");
      onNotesGenerated(notes.draft);
    } catch (generationError) {
      setError(
        generationError instanceof Error ? generationError.message : "Unable to generate summary."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleExportPdf() {
    if (!activeIntake || !latestDraft || !consultationId) {
      setError("Generate the consultation summary first, then export the PDF report.");
      return;
    }

    setIsExporting(true);
    setError(null);
    setStatus(null);

    try {
      const report = await apiRequest<ReportResponse>("/reports/generate", {
        method: "POST",
        body: {
          patient_id: activeIntake.patientId,
          consultation_id: consultationId,
          patient_name: activeIntake.name,
          clinician_name: "Frontend Demo Clinician",
          triage: {
            urgency: activeIntake.urgency,
            triage_score: activeIntake.triageScore,
            recommended_route: activeIntake.route,
            rationale: activeIntake.rationale,
            risk_factors: activeIntake.rationale
          },
          notes: latestDraft
        }
      });

      setReportDownloadUrl(
        `http://127.0.0.1:8000/api/v1/reports/${report.report_id}/download`
      );
      setStatus("PDF report generated successfully on the backend.");
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Unable to export PDF.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="glass-panel rounded-[28px] p-5 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Consultation capture</h3>
          <p className="text-sm text-slate-600">
            Speech-to-structure workflow with transcript review, note generation, and PDF-ready
            output.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleMicToggle}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              isRecording
                ? "bg-rose-100 text-rose-800 ring-1 ring-rose-200 hover:bg-rose-200"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecording ? "Stop mic" : "Start mic"}
          </button>
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Generating summary..." : "Generate summary"}
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting || !latestDraft || !consultationId}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting PDF..." : "Export PDF"}
          </button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-rose-700">{error}</p> : null}
      {status ? <p className="mb-4 text-sm text-emerald-700">{status}</p> : null}
      {reportDownloadUrl ? (
        <a
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700 underline underline-offset-4"
          href={reportDownloadUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Download className="h-4 w-4" />
          Download generated report
        </a>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.03)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-50 text-cyan-700">
              <AudioLines className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Live transcript</h4>
              <p className="text-sm text-slate-500">Mic-enabled transcript with live browser capture</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
              {(["Doctor", "Patient"] as TranscriptSpeaker[]).map((speaker) => (
                <button
                  key={speaker}
                  type="button"
                  onClick={() => setActiveSpeaker(speaker)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition",
                    activeSpeaker === speaker
                      ? "bg-white text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {speaker}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500">Mic capture speaker: {activeSpeaker}</span>
          </div>

          <div className="space-y-3">
            {liveTranscript.map((line) => (
              <article
                key={`${line.speaker}-${line.time}`}
                className={`rounded-[20px] p-4 ${
                  line.speaker === "Doctor"
                    ? "bg-slate-100 text-slate-700"
                    : "bg-cyan-50 text-cyan-950"
                }`}
              >
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em]">
                  <span>{line.speaker}</span>
                  <span>{line.time}</span>
                </div>
                <p className="text-sm leading-6">{line.text}</p>
              </article>
            ))}
            {draftUtterance ? (
              <article className="rounded-[20px] border border-dashed border-cyan-200 bg-cyan-50/60 p-4 text-cyan-950">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em]">
                  <span>{activeSpeaker}</span>
                  <span>listening...</span>
                </div>
                <p className="text-sm leading-6">{draftUtterance}</p>
              </article>
            ) : null}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-4 text-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
          <div className="grid gap-3">
            <div className="rounded-[20px] bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Symptoms tagged
              </p>
              <p className="mt-2 text-3xl font-semibold">{generatedStats.symptoms}</p>
            </div>
            <div className="rounded-[20px] bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Diagnoses surfaced
              </p>
              <p className="mt-2 text-3xl font-semibold">{generatedStats.diagnoses}</p>
            </div>
            <div className="rounded-[20px] bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Summary confidence
              </p>
              <p className="mt-2 text-3xl font-semibold">94%</p>
            </div>
          </div>

          <div className="mt-3 rounded-[22px] bg-white/6 p-4 text-sm leading-6 text-slate-200">
            Notes are generated by the local FastAPI backend, and the export button now creates a
            backend PDF once the summary exists.
          </div>
        </div>
      </div>
    </section>
  );
}
