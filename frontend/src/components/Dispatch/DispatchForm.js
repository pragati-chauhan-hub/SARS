import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';

const DispatchForm = ({ emergency, onOptimize, onDispatch, loading = false }) => {
  const [formData, setFormData] = useState({
    hospital_name: '',
    hospital_location: '',
    hospital_latitude: '',
    hospital_longitude: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hospital_name) newErrors.hospital_name = 'Hospital name is required';
    if (!formData.hospital_location) newErrors.hospital_location = 'Hospital location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await onOptimize?.({
        emergency_id: emergency.id,
        emergency_latitude: emergency.latitude || 0,
        emergency_longitude: emergency.longitude || 0,
        hospital_latitude: parseFloat(formData.hospital_latitude) || undefined,
        hospital_longitude: parseFloat(formData.hospital_longitude) || undefined,
        hospital_name: formData.hospital_name,
        hospital_location: formData.hospital_location,
      });
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Dispatch Details
        </Typography>

        <Box component="form" onSubmit={handleOptimize} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="info">
            Emergency: <strong>{emergency.patient_name}</strong> at {emergency.location}
          </Alert>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>Hospital Information</Typography>

          <TextField
            label="Hospital Name"
            name="hospital_name"
            value={formData.hospital_name}
            onChange={handleChange}
            error={!!errors.hospital_name}
            helperText={errors.hospital_name}
            fullWidth
            required
          />

          <TextField
            label="Hospital Location/Address"
            name="hospital_location"
            value={formData.hospital_location}
            onChange={handleChange}
            error={!!errors.hospital_location}
            helperText={errors.hospital_location}
            fullWidth
            required
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Latitude (Optional)"
              name="hospital_latitude"
              type="number"
              value={formData.hospital_latitude}
              onChange={handleChange}
              inputProps={{ step: '0.00001' }}
              fullWidth
            />
            <TextField
              label="Longitude (Optional)"
              name="hospital_longitude"
              type="number"
              value={formData.hospital_longitude}
              onChange={handleChange}
              inputProps={{ step: '0.00001' }}
              fullWidth
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Optimizing Routes...
              </>
            ) : (
              'Optimize Routes'
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DispatchForm;
