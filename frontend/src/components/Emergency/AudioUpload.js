import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AudioUpload = ({ onFileSelect, onUploadStart, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    processFile(files[0]);
  };

  const handleFileSelect = (e) => {
    processFile(e.target.files[0]);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a valid audio file (MP3, WAV, or M4A)');
      return;
    }

    setFile(selectedFile);
    setError(null);
    onFileSelect?.(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    onUploadStart?.();
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      onUploadComplete?.();
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      onDrop={handleFileDrop}
      onDragOver={(e) => e.preventDefault()}
      sx={{
        border: '2px dashed #1976D2',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        backgroundColor: '#f0f7ff',
        cursor: 'pointer',
        transition: 'all 0.3s',
        '&:hover': {
          backgroundColor: '#e3f2fd',
          borderColor: '#1565c0',
        },
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 48, color: '#1976D2', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Drag and drop audio file here
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        or
      </Typography>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="audio-input"
      />
      <label htmlFor="audio-input">
        <Button
          component="span"
          variant="contained"
          sx={{ mb: 2 }}
        >
          Select File
        </Button>
      </label>

      {file && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Selected: <strong>{file.name}</strong>
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload & Transcribe'}
          </Button>
        </Box>
      )}

      {uploading && <LinearProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default AudioUpload;
