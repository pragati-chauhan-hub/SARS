import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Chip, Stack, Button } from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';
import TomTomMap from '../components/Map/TomTomMap';
import { ambulanceAPI, emergencyAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const LiveTracking = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Set up polling for real-time updates
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [ambResponse, emgResponse] = await Promise.all([
        ambulanceAPI.list({ limit: 100 }),
        emergencyAPI.list({ limit: 100 }),
      ]);
      setAmbulances(ambResponse.data);
      setEmergencies(emgResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const activeAmbulances = ambulances.filter(a => a.status !== 'available');
  const activeEmergencies = emergencies.filter(e => e.status !== 'resolved');

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          📍 Live Tracking
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Live Map
            </Typography>
            <TomTomMap
              markers={[
                ...ambulances.map(a => ({ id: a.id, name: a.name, type: 'ambulance' })),
                ...emergencies.map(e => ({ id: e.id, name: e.patient_name, type: 'emergency' })),
              ]}
            />
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚑 Active Ambulances ({activeAmbulances.length})
              </Typography>
              <Stack spacing={1}>
                {activeAmbulances.map(ambulance => (
                  <Box
                    key={ambulance.id}
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {ambulance.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {ambulance.vehicle_number}
                      </Typography>
                    </Box>
                    <Chip
                      label={ambulance.status}
                      size="small"
                      color={ambulance.status === 'en_route' ? 'primary' : 'warning'}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚨 Active Emergencies ({activeEmergencies.length})
              </Typography>
              <Stack spacing={1}>
                {activeEmergencies.map(emergency => (
                  <Box
                    key={emergency.id}
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {emergency.patient_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {emergency.location}
                      </Typography>
                    </Box>
                    <Chip
                      label={emergency.status}
                      size="small"
                      color={emergency.priority === 'critical' ? 'error' : 'warning'}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default LiveTracking;
