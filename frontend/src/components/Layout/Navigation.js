import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Box,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {onToggleSidebar && (
          <IconButton
            color="inherit"
            onClick={onToggleSidebar}
            sx={{ 
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            title="Toggle Sidebar"
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            fontSize: '1.3rem',
          }}
        >
          🚑 SARS System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <Typography 
                variant="body2" 
                sx={{
                  fontWeight: 500,
                  opacity: 0.95,
                }}
              >
                {user.full_name || user.username}
              </Typography>
              <Avatar
                sx={{ 
                  cursor: 'pointer', 
                  background: 'linear-gradient(135deg, #f57c00 0%, #ff6f00 100%)',
                  fontWeight: 'bold',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(245, 124, 0, 0.3)',
                  },
                }}
                onClick={handleMenuOpen}
              >
                {user.full_name?.charAt(0) || 'U'}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => navigate('/settings')}>⚙️ Settings</MenuItem>
                <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
