import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { emergencyAPI, ambulanceAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_emergencies: 0,
    active_ambulances: 0,
    available_ambulances: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [emergencies, ambulances] = await Promise.all([
        emergencyAPI.list({ limit: 1000 }),
        ambulanceAPI.list({ limit: 1000 }),
      ]);

      setStats({
        total_emergencies: emergencies.data.length,
        active_ambulances: ambulances.data.length,
        available_ambulances: ambulances.data.filter(a => a.status === 'available').length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({ title, value, icon }) => (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(25, 118, 210, 0.1)',
        '&:hover': {
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Box 
          sx={{ 
            fontSize: 48, 
            mb: 2,
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }}
        >
          {icon}
        </Box>
        <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: 4,
            background: 'linear-gradient(135deg, #1976d2 0%, #f57c00 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          📊 Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Emergencies"
              value={stats.total_emergencies}
              icon="🚨"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Active Ambulances"
              value={stats.active_ambulances}
              icon="🚑"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Available Ambulances"
              value={stats.available_ambulances}
              icon="✅"
            />
          </Grid>
        </Grid>

        <Card
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(25, 118, 210, 0.1)',
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2.5 }}>
              ⚡ Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/emergencies')}
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  },
                }}
              >
                🆕 New Emergency
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/emergencies')}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  borderColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.05)',
                  },
                }}
              >
                👀 View Emergencies
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/ambulances')}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  borderColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.05)',
                  },
                }}
              >
                🚑 Manage Ambulances
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/dispatch')}
                sx={{
                  fontWeight: 600,
                  px: 3,
                  borderColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.05)',
                  },
                }}
              >
                📍 Dispatch
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default Dashboard;
