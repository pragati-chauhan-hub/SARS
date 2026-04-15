import React, { useState, useEffect } from 'react';
import { Container, Button, Box, Typography, Tabs, Tab, Card, CardContent } from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';
import EmergencyCard from '../components/Emergency/EmergencyCard';
import AudioUpload from '../components/Emergency/AudioUpload';
import EmergencyForm from '../components/Emergency/EmergencyForm';
import { emergencyAPI, transcriptionAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const ActiveEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [transcribedData, setTranscribedData] = useState(null);

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    try {
      const response = await emergencyAPI.list({ limit: 100 });
      setEmergencies(response.data);
    } catch (error) {
      console.error('Error loading emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = async (file) => {
    try {
      setLoading(true);
      const response = await transcriptionAPI.process(file);
      setTranscribedData(response.data);
      setTabValue(1);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      await emergencyAPI.create(formData);
      await loadEmergencies();
      setTranscribedData(null);
      setTabValue(0);
    } catch (error) {
      console.error('Error creating emergency:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && emergencies.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          🚨 Emergency Management
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Emergency List" />
            <Tab label="New Emergency" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Active Emergencies ({emergencies.length})
            </Typography>
            {emergencies.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    No emergencies recorded
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              emergencies.map(emergency => (
                <EmergencyCard
                  key={emergency.id}
                  emergency={emergency}
                  onEdit={() => { /* TODO */ }}
                  onDelete={() => { /* TODO */ }}
                />
              ))
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Step 1: Upload Emergency Call Recording
                </Typography>
                <AudioUpload onFileSelect={handleAudioUpload} />
              </CardContent>
            </Card>

            {transcribedData && (
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Step 2: Review & Edit Emergency Details
                  </Typography>
                  <EmergencyForm
                    initialData={transcribedData}
                    onSubmit={handleFormSubmit}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Container>
    </MainLayout>
  );
};

export default ActiveEmergencies;
