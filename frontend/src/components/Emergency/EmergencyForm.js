import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  Alert,
} from '@mui/material';

const EmergencyForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    patient_name: initialData.patient_name || '',
    patient_phone: initialData.patient_phone || '',
    location: initialData.location || '',
    condition: initialData.condition || '',
    priority: initialData.priority || 'medium',
    caller_name: initialData.caller_name || '',
    caller_phone: initialData.caller_phone || '',
    description: initialData.description || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patient_name) newErrors.patient_name = 'Patient name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Emergency Details</Typography>

      <TextField
        label="Patient Name"
        name="patient_name"
        value={formData.patient_name}
        onChange={handleChange}
        error={!!errors.patient_name}
        helperText={errors.patient_name}
        fullWidth
        required
      />

      <TextField
        label="Patient Phone"
        name="patient_phone"
        value={formData.patient_phone}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        error={!!errors.location}
        helperText={errors.location}
        fullWidth
        required
      />

      <TextField
        label="Medical Condition"
        name="condition"
        value={formData.condition}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Priority Level</InputLabel>
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          label="Priority Level"
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="critical">Critical</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle2" sx={{ mt: 2 }}>Caller Information</Typography>

      <TextField
        label="Caller Name"
        name="caller_name"
        value={formData.caller_name}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Caller Phone"
        name="caller_phone"
        value={formData.caller_phone}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Additional Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Submitting...' : 'Submit Emergency'}
        </Button>
      </Stack>
    </Box>
  );
};

export default EmergencyForm;
