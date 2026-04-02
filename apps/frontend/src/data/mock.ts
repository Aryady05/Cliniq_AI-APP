import type {
  CarePathway,
  Metric,
  NoteSection,
  QueuePatient,
  SymptomQuestion,
  TranscriptLine
} from "../types/clinical";

export const metrics: Metric[] = [
  {
    label: "Patients screened today",
    value: "184",
    change: "+22 from yesterday",
    tone: "teal"
  },
  {
    label: "Critical cases surfaced",
    value: "11",
    change: "2 escalated in under 3 min",
    tone: "rose"
  },
  {
    label: "Avg triage completion",
    value: "02:14",
    change: "31 sec faster",
    tone: "amber"
  },
  {
    label: "Draft notes generated",
    value: "67",
    change: "91% doctor accepted",
    tone: "slate"
  }
];

export const queuePatients: QueuePatient[] = [
  {
    id: "PT-104",
    name: "Nandita Rao",
    age: 62,
    concern: "Chest tightness, dizziness",
    waitTime: "01 min",
    triageScore: 96,
    urgency: "critical",
    route: "Immediate resuscitation bay"
  },
  {
    id: "PT-109",
    name: "Aman Sheikh",
    age: 8,
    concern: "High fever and lethargy",
    waitTime: "04 min",
    triageScore: 82,
    urgency: "high",
    route: "Pediatric fast-track"
  },
  {
    id: "PT-117",
    name: "Riya Sen",
    age: 29,
    concern: "Shortness of breath after exertion",
    waitTime: "08 min",
    triageScore: 67,
    urgency: "moderate",
    route: "Respiratory consult"
  },
  {
    id: "PT-123",
    name: "Kabir Jain",
    age: 41,
    concern: "Medication refill, mild cough",
    waitTime: "13 min",
    triageScore: 24,
    urgency: "low",
    route: "Primary care queue"
  }
];

export const symptomQuestions: SymptomQuestion[] = [
  {
    id: "symptom-onset",
    question: "When did the main symptom begin?",
    options: ["Within 1 hour", "Today", "2-7 days ago", "More than a week ago"]
  },
  {
    id: "breathing",
    question: "Is the patient having trouble breathing?",
    options: ["Severe", "Mild", "No"]
  },
  {
    id: "pain",
    question: "How intense is the pain right now?",
    options: ["8-10 severe", "4-7 moderate", "0-3 mild"]
  },
  {
    id: "red-flags",
    question: "Any red flag signs present?",
    options: ["Confusion", "Bleeding", "None observed"]
  }
];

export const transcript: TranscriptLine[] = [
  {
    speaker: "Doctor",
    time: "09:02",
    text: "Can you describe what brought you in today?"
  },
  {
    speaker: "Patient",
    time: "09:02",
    text: "I started feeling pressure in my chest while climbing the stairs and got dizzy."
  },
  {
    speaker: "Doctor",
    time: "09:03",
    text: "Did you feel short of breath, and have you had symptoms like this before?"
  },
  {
    speaker: "Patient",
    time: "09:03",
    text: "Yes, I felt breathless, and this is the second time this month."
  }
];

export const noteSections: NoteSection[] = [
  {
    title: "Symptoms",
    content: [
      "Chest pressure on exertion",
      "Associated dizziness and mild dyspnea",
      "Second similar episode within one month"
    ]
  },
  {
    title: "Preliminary diagnosis",
    content: [
      "Rule out unstable angina",
      "Consider acute coronary syndrome given recurrent exertional chest pain"
    ]
  },
  {
    title: "Prescription / immediate orders",
    content: [
      "ECG within 10 minutes",
      "Cardiac enzyme panel",
      "Aspirin protocol if not contraindicated"
    ]
  },
  {
    title: "Clinical notes",
    content: [
      "Patient alert and oriented",
      "Urgency engine flagged high-risk due to exertional onset plus dizziness"
    ]
  }
];

export const carePathways: CarePathway[] = [
  {
    title: "Emergency escalation",
    description: "Send high-risk patients directly to the emergency team with one-tap handoff.",
    eta: "< 3 min",
    owner: "ER command desk"
  },
  {
    title: "Specialist routing",
    description: "Recommend cardiology, respiratory, neurology, or pediatrics based on symptom clusters.",
    eta: "5-12 min",
    owner: "Smart triage router"
  },
  {
    title: "Virtual follow-up",
    description: "Low-risk patients can be moved into digital consult or remote monitoring queues.",
    eta: "Same day",
    owner: "OPD coordination"
  }
];
