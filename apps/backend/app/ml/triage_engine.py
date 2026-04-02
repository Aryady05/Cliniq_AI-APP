from app.schemas.triage import TriageInput, TriageResult


class HybridTriageEngine:
    red_flag_weights = {
        "chest pain": 35,
        "shortness of breath": 25,
        "confusion": 30,
        "bleeding": 30,
        "loss of consciousness": 40,
        "stroke symptoms": 40,
    }

    route_map = {
        "critical": "Immediate emergency response",
        "high": "Urgent clinician review",
        "moderate": "Specialist or priority OPD route",
        "low": "Standard OPD or teleconsult follow-up",
    }

    def score(self, payload: TriageInput) -> TriageResult:
        complaint = payload.chief_complaint.lower()
        symptoms = [item.lower() for item in payload.symptoms]
        red_flags = [item.lower() for item in payload.red_flags]
        rationale: list[str] = []
        risk_factors: list[str] = []

        score = 10

        for phrase, weight in self.red_flag_weights.items():
            if phrase in complaint or any(phrase in symptom for symptom in symptoms):
                score += weight
                risk_factors.append(phrase)
                rationale.append(f"Detected high-risk phrase: {phrase}")

        for red_flag in red_flags:
            if red_flag != "none":
                score += 20
                risk_factors.append(red_flag)
                rationale.append(f"Red flag reported: {red_flag}")

        if payload.age and payload.age >= 60:
            score += 8
            rationale.append("Age-adjusted risk applied")

        if payload.vitals:
            if payload.vitals.spo2 is not None and payload.vitals.spo2 < 94:
                score += 20
                rationale.append("Low oxygen saturation detected")
            if payload.vitals.pulse is not None and payload.vitals.pulse > 110:
                score += 10
                rationale.append("Elevated pulse detected")
            if payload.vitals.systolic_bp is not None and payload.vitals.systolic_bp > 180:
                score += 12
                rationale.append("Very high systolic blood pressure detected")

        score = min(score, 100)

        if score >= 85:
            urgency = "critical"
        elif score >= 65:
            urgency = "high"
        elif score >= 35:
            urgency = "moderate"
        else:
            urgency = "low"

        if not rationale:
            rationale.append("No major red flags detected; baseline triage rules applied")

        return TriageResult(
            urgency=urgency,
            triage_score=score,
            recommended_route=self.route_map[urgency],
            rationale=rationale,
            risk_factors=risk_factors,
        )
