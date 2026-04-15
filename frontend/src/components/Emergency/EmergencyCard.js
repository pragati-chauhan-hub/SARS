import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useState } from 'react';

const statusColors = {
  pending: '#ff9800',
  en_route: '#2196f3',
  at_scene: '#f44336',
  resolved: '#4caf50',
};

const priorityColors = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  critical: '#8b0000',
};

const EmergencyCard = ({ emergency, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {emergency.patient_name}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              📍 {emergency.location}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Condition: {emergency.condition || 'Not specified'}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip
                label={emergency.status}
                size="small"
                sx={{ backgroundColor: statusColors[emergency.status], color: 'white' }}
              />
              <Chip
                label={emergency.priority}
                size="small"
                sx={{ backgroundColor: priorityColors[emergency.priority], color: 'white' }}
              />
            </Stack>
          </Box>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </CardContent>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => {
          onEdit?.(emergency);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1, fontSize: '18px' }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          onDelete?.(emergency.id);
          handleMenuClose();
        }}>
          <DeleteIcon sx={{ mr: 1, fontSize: '18px' }} /> Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default EmergencyCard;
