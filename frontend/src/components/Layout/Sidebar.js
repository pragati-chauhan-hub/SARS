import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  LocalShipping as AmbulanceIcon,
  Map as MapIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/emergencies', label: 'Emergencies', icon: WarningIcon },
    { path: '/ambulances', label: 'Ambulances', icon: AmbulanceIcon },
    { path: '/dispatch', label: 'Dispatch', icon: MapIcon },
    { path: '/tracking', label: 'Live Tracking', icon: MapIcon },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          background: 'linear-gradient(180deg, #263238 0%, #1a1f24 100%)',
          color: 'white',
          width: 250,
          boxShadow: '4px 0 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Box sx={{ p: 2, background: 'rgba(25, 118, 210, 0.1)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, letterSpacing: '0.5px' }}>
          🚑 SARS
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {user?.role.toUpperCase() || 'User'} • {user?.full_name || user?.username}
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
      <List>
        {menuItems.map(({ path, label, icon: Icon }) => (
          <ListItem
            button
            key={path}
            onClick={() => handleNavigate(path)}
            sx={{
              backgroundColor: isActive(path) ? 'rgba(25, 118, 210, 0.2)' : 'transparent',
              borderLeft: isActive(path) ? '4px solid #1976D2' : '4px solid transparent',
              color: isActive(path) ? '#fff' : 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
              },
              pl: 2,
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: isActive(path) ? '#1976D2' : 'rgba(255, 255, 255, 0.7)',
                transition: 'color 0.3s',
              }}
            >
              <Icon />
            </ListItemIcon>
            <ListItemText 
              primary={label}
              sx={{
                fontWeight: isActive(path) ? 600 : 500,
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List>
        <ListItem
          button
          onClick={() => handleNavigate('/settings')}
          sx={{ 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            } 
          }}
        >
          <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Settings"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
