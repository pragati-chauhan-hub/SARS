import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RouteIcon from '@mui/icons-material/Route';

const AmbulanceSelector = ({ routes, onSelect, loading = false, countdown = null }) => {
  const [selectedId, setSelectedId] = useState(routes?.[0]?.ambulance_id);

  const handleSelect = (ambulanceId) => {
    setSelectedId(ambulanceId);
  };

  const handleDispatch = () => {
    onSelect?.(selectedId);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Select Ambulance for Dispatch
      </Typography>

      {countdown !== null && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Auto-dispatch in {countdown} seconds...
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Ambulance</TableCell>
              <TableCell align="right">Distance</TableCell>
              <TableCell align="right">ETA</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes?.map((route) => (
              <TableRow
                key={route.ambulance_id}
                sx={{
                  backgroundColor: selectedId === route.ambulance_id ? '#e3f2fd' : 'transparent',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                }}
                onClick={() => handleSelect(route.ambulance_id)}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon />
                    {route.ambulance_name}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    <RouteIcon fontSize="small" />
                    {route.distance_km.toFixed(2)} km
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" />
                    {route.eta_minutes} min
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant={selectedId === route.ambulance_id ? 'contained' : 'outlined'}
                    onClick={() => handleSelect(route.ambulance_id)}
                  >
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handleDispatch}
        disabled={loading || !selectedId}
        sx={{ mt: 3, py: 1.5, fontSize: '1.1rem' }}
      >
        {loading ? 'Dispatching...' : 'Confirm & Dispatch'}
      </Button>
    </Box>
  );
};

export default AmbulanceSelector;
