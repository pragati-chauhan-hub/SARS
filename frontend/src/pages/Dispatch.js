import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Alert } from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';
import DispatchForm from '../components/Dispatch/DispatchForm';
import AmbulanceSelector from '../components/Dispatch/AmbulanceSelector';
import TomTomMap from '../components/Map/TomTomMap';
import { emergencyAPI, dispatchAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Dispatch = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    try {
      const response = await emergencyAPI.list({ limit: 100 });
      const pendingEmergencies = response.data.filter(e => e.status === 'pending');
      setEmergencies(pendingEmergencies);
      if (pendingEmergencies.length > 0) {
        setSelectedEmergency(pendingEmergencies[0]);
      }
    } catch (error) {
      console.error('Error loading emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async (data) => {
    try {
      setLoading(true);
      const response = await dispatchAPI.optimize(data);
      setRoutes(response.data.routes);
    } catch (error) {
      console.error('Error optimizing routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (ambulanceId) => {
    try {
      setLoading(true);
      // Find hospital data from form
      await dispatchAPI.create({
        emergency_id: selectedEmergency.id,
        ambulance_id: ambulanceId,
      });
      // Reload emergencies
      await loadEmergencies();
      setRoutes([]);
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
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
          🚀 Dispatch Management
        </Typography>

        {!selectedEmergency ? (
          <Alert severity="info">No pending emergencies available for dispatch</Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DispatchForm
                emergency={selectedEmergency}
                onOptimize={handleOptimize}
                loading={loading}
              />

              {routes.length > 0 && (
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <AmbulanceSelector
                      routes={routes}
                      onSelect={handleDispatch}
                      loading={loading}
                    />
                  </CardContent>
                </Card>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Route Map
                  </Typography>
                  <TomTomMap
                    center={[selectedEmergency.latitude || 0, selectedEmergency.longitude || 0]}
                    markers={routes.map(r => ({
                      id: r.ambulance_id,
                      name: r.ambulance_name,
                    }))}
                    routes={routes}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
};

export default Dispatch;
