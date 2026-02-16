import React, { useState, useEffect } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { CheckCircle, Error, Warning } from '@mui/icons-material';
import { eventApi } from '../../services/api';

const ConnectionStatus: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await eventApi.getPublishedEvents();
        setConnectionStatus('connected');
      } catch (error) {
        console.log('Backend connection failed:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          label: 'Backend Connected',
          color: 'success' as const,
          icon: <CheckCircle />,
          tooltip: 'Successfully connected to backend server',
        };
      case 'disconnected':
        return {
          label: 'Backend Offline',
          color: 'error' as const,
          icon: <Error />,
          tooltip: 'Cannot connect to backend server. Please start the Spring Boot application.',
        };
      default:
        return {
          label: 'Checking...',
          color: 'warning' as const,
          icon: <Warning />,
          tooltip: 'Checking backend connection',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Box sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1000 }}>
      <Tooltip title={config.tooltip}>
        <Chip
          icon={config.icon}
          label={config.label}
          color={config.color}
          variant="filled"
          size="small"
        />
      </Tooltip>
    </Box>
  );
};

export default ConnectionStatus;