import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const TomTomMap = ({ center = [0, 0], markers = [], routes = [] }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '500px',
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        border: '1px solid #bdbdbd',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          🗺️ Map Integration
        </Typography>
        <Typography variant="caption" color="textSecondary">
          TomTom Maps API will be displayed here
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Center: {center[0].toFixed(3)}, {center[1].toFixed(3)}
        </Typography>
        <Typography variant="caption" display="block">
          Markers: {markers.length} | Routes: {routes.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default TomTomMap;
