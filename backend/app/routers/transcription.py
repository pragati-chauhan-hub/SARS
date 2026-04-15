"""
Transcription and AI data extraction endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.transcription_service import transcription_service
from app.schemas.emergency import TranscriptionResponse
import logging
import os
import shutil

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/transcription", tags=["transcription"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/process", response_model=TranscriptionResponse)
async def process_audio(file: UploadFile = File(...)):
    """
    Upload audio file, transcribe it, and extract emergency data
    """
    try:
        # Save uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"Received audio file: {file.filename}")
        
        # Transcribe audio
        transcribed_text = await transcription_service.transcribe_audio(file_path)
        logger.info(f"Transcribed text: {transcribed_text}")
        
        # Extract structured data
        emergency_data = await transcription_service.extract_emergency_data(transcribed_text)
        
        # Clean up uploaded file
        os.remove(file_path)
        
        return emergency_data
        
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing audio file")
