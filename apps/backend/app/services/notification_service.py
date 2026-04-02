from app.schemas.common import APIMessage


class NotificationService:
    def send_triage_alert(self, phone: str | None, urgency: str) -> APIMessage:
        target = phone or "unregistered-contact"
        return APIMessage(
            message=f"MSG91 dispatch placeholder for {target} with urgency {urgency}"
        )
