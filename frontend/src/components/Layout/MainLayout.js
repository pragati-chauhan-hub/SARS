import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navigation from './Navigation';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Box sx={{ display: 'flex', flex: 1 }}>
        {sidebarOpen && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
            overflow: 'auto',
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
