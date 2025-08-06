import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Error as ErrorIcon, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh',
            p: 2 
          }}
        >
          <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                We encountered an unexpected error. Please try refreshing the page.
              </Typography>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    bgcolor: 'grey.100', 
                    p: 2, 
                    borderRadius: 1, 
                    mb: 2,
                    fontFamily: 'monospace',
                    textAlign: 'left',
                    fontSize: '0.75rem'
                  }}
                >
                  {this.state.error.toString()}
                </Typography>
              )}
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;