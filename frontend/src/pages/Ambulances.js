import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';
import { ambulanceAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Ambulances = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAmbulances();
  }, []);

  const loadAmbulances = async () => {
    try {
      const response = await ambulanceAPI.list({ limit: 100 });
      setAmbulances(response.data);
    } catch (error) {
      console.error('Error loading ambulances:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'success',
      en_route: 'info',
      at_scene: 'error',
      returning: 'warning',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          🚑 Ambulance Fleet Management
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Vehicle #</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Capacity</strong></TableCell>
                <TableCell><strong>Driver</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ambulances.map((ambulance) => (
                <TableRow key={ambulance.id} hover>
                  <TableCell>{ambulance.name}</TableCell>
                  <TableCell>{ambulance.vehicle_number}</TableCell>
                  <TableCell>
                    <Chip
                      label={ambulance.status}
                      color={getStatusColor(ambulance.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{ambulance.ambulance_type}</TableCell>
                  <TableCell>{ambulance.capacity} persons</TableCell>
                  <TableCell>
                    {ambulance.driver?.name || 'Not assigned'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </MainLayout>
  );
};

export default Ambulances;
