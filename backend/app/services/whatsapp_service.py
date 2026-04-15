"""
WhatsApp service using Twilio API for sending dispatch notifications
"""
from app.config import settings
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class WhatsAppService:
    def __init__(self):
        self.account_sid = settings.TWILIO_ACCOUNT_SID
        self.auth_token = settings.TWILIO_AUTH_TOKEN
        self.whatsapp_number = settings.TWILIO_WHATSAPP_NUMBER
    
    async def send_dispatch_notification(
        self,
        driver_phone: str,
        ambulance_name: str,
        patient_name: str,
        location: str,
        hospital_name: str,
        hospital_address: str,
        eta_minutes: int
    ) -> dict:
        """
        Send WhatsApp notification to driver with dispatch details
        
        Args:
            driver_phone: Driver's WhatsApp phone number
            ambulance_name: Name/number of ambulance
            patient_name: Patient name
            location: Emergency location
            hospital_name: Hospital name
            hospital_address: Hospital address
            eta_minutes: Estimated time to hospital
            
        Returns:
            Status dict with delivery info
        """
        try:
            # For now, return mock response
            # In production, implement actual Twilio API call
            
            message_body = f"""
🚑 DISPATCH ALERT

Ambulance: {ambulance_name}
Patient: {patient_name}
Location: {location}
Hospital: {hospital_name}
Address: {hospital_address}
ETA: {eta_minutes} minutes

Please acknowledge receipt and head to the location immediately.
"""
            
            logger.info(f"Sending WhatsApp to {driver_phone}: {message_body}")
            
            # Actual Twilio code:
            # from twilio.rest import Client
            # client = Client(self.account_sid, self.auth_token)
            # message = client.messages.create(
            #     from_=self.whatsapp_number,
            #     body=message_body,
            #     to=f"whatsapp:{driver_phone}"
            # )
            
            return {
                "status": "sent",
                "message_id": "mock_message_id",
                "delivery_status": "pending"
            }
        except Exception as e:
            logger.error(f"Error sending WhatsApp: {str(e)}")
            return {
                "status": "failed",
                "error": str(e)
            }
    
    async def get_delivery_status(self, message_id: str) -> dict:
        """
        Get WhatsApp message delivery status
        
        Args:
            message_id: Twilio message ID
            
        Returns:
            Delivery status info
        """
        try:
            logger.info(f"Checking delivery status for message: {message_id}")
            
            # In production, use Twilio API to check actual status
            return {
                "message_id": message_id,
                "status": "delivered",
                "timestamp": None
            }
        except Exception as e:
            logger.error(f"Error getting delivery status: {str(e)}")
            return {"status": "unknown", "error": str(e)}


whatsapp_service = WhatsAppService()
