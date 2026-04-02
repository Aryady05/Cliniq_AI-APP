export type UrgencyLevel = "critical" | "high" | "moderate" | "low";

export type QueuePatient = {
  id: string;
  name: string;
  age: number;
  concern: string;
  waitTime: string;
  triageScore: number;
  urgency: UrgencyLevel;
  route: string;
};

export type IntakeSummary = {
  patientId: string;
  patientLabel: string;
  name: string;
  age: number;
  concern: string;
  triageScore: number;
  urgency: UrgencyLevel;
  route: string;
  rationale: string[];
  notes?: string | null;
};

export type Metric = {
  label: string;
  value: string;
  change: string;
  tone: "teal" | "amber" | "rose" | "slate";
};

export type SymptomQuestion = {
  id: string;
  question: string;
  options: string[];
};

export type TranscriptLine = {
  speaker: "Doctor" | "Patient";
  text: string;
  time: string;
};

export type CarePathway = {
  title: string;
  description: string;
  eta: string;
  owner: string;
};

export type NoteSection = {
  title: string;
  content: string[];
};

export type BackendNoteDraft = {
  symptoms: string[];
  diagnosis: string[];
  prescription: string[];
  notes: string[];
  follow_up: string[];
};
