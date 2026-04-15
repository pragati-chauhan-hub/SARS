import React from 'react';
import { Container, Typography, Button, Card, CardContent, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          ⚙️ Settings
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Account Settings</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Manage your profile and account preferences
              </Typography>
              <Button variant="outlined" fullWidth>
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Configure notification preferences
              </Typography>
              <Button variant="outlined" fullWidth>
                Configure
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>API Keys</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Manage API credentials
              </Typography>
              <Button variant="outlined" fullWidth>
                Manage Keys
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>System Settings</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Configure application settings
              </Typography>
              <Button variant="outlined" fullWidth>
                Configure
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Settings;
