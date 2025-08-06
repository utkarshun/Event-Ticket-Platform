import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import ConnectionStatus from '../Common/ConnectionStatus';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const Layout: React.FC<LayoutProps> = ({ children, maxWidth = 'lg' }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Header />
      <Container maxWidth={maxWidth} sx={{ py: 4 }}>
        {children}
      </Container>
      <ConnectionStatus />
    </Box>
  );
};

export default Layout;