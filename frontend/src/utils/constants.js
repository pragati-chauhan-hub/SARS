export const APP_CONSTANTS = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  TOMTOM_API_KEY: process.env.REACT_APP_TOMTOM_API_KEY,
  
  EMERGENCY_STATUS: {
    PENDING: 'pending',
    EN_ROUTE: 'en_route',
    AT_SCENE: 'at_scene',
    RESOLVED: 'resolved',
  },
  
  AMBULANCE_STATUS: {
    AVAILABLE: 'available',
    EN_ROUTE: 'en_route',
    AT_SCENE: 'at_scene',
    RETURNING: 'returning',
  },
  
  PRIORITY_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  },
};
