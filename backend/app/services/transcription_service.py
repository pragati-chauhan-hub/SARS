"""
Transcription service using Groq API for converting audio to text
and extracting emergency information using AI
"""
import json
from typing import Optional
from app.config import settings
from app.schemas.emergency import TranscriptionResponse, PriorityLevel
import logging

logger = logging.getLogger(__name__)


class TranscriptionService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
    
    async def transcribe_audio(self, audio_file_path: str) -> str:
        """
        Transcribe audio file using Groq API
        
        Args:
            audio_file_path: Path to the audio file
            
        Returns:
            Transcribed text
        """
        try:
            # For now, return mock transcription
            # In production, implement actual Groq API call
            logger.info(f"Transcribing audio file: {audio_file_path}")
            
            # This would use actual Groq API:
            # from groq import Groq
            # client = Groq(api_key=self.api_key)
            # with open(audio_file_path, "rb") as f:
            #     transcription = client.audio.transcriptions.create(...)
            
            return "Patient John Doe is having severe chest pain at 123 Main Street. He is conscious but in distress."
        except Exception as e:
            logger.error(f"Error transcribing audio: {str(e)}")
            raise
    
    async def extract_emergency_data(self, transcribed_text: str) -> TranscriptionResponse:
        """
        Extract structured emergency data from transcribed text using AI
        
        Args:
            transcribed_text: Transcribed audio text
            
        Returns:
            Structured emergency data
        """
        try:
            logger.info("Extracting emergency data from transcription")
            
            # For now, return mock extraction
            # In production, implement actual AI extraction with Groq
            
            # Parse the transcription to extract key information
            response = TranscriptionResponse(
                patient_name="John Doe",
                location="123 Main Street",
                condition="Severe chest pain",
                priority=PriorityLevel.CRITICAL,
                description=transcribed_text,
                caller_name="John Doe",
                caller_phone=None,
                transcribed_text=transcribed_text
            )
            return response
        except Exception as e:
            logger.error(f"Error extracting emergency data: {str(e)}")
            raise


transcription_service = TranscriptionService()
