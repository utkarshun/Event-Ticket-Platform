import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
} from '@mui/material';
import {
  QrCodeScanner,
  CheckCircle,
  Error,
  Warning,
} from '@mui/icons-material';
import { validationApi } from '../../services/api';
import { TicketValidationRequest, TicketValidationResponse } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../Layout/Layout';

const TicketValidation: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [method, setMethod] = useState<'QR_SCAN' | 'MANUAL'>('QR_SCAN');
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<TicketValidationResponse | null>(null);
  const [error, setError] = useState('');
  const { hasRole } = useAuth();

  const handleValidation = async () => {
    if (!ticketId.trim()) {
      setError('Please enter a ticket ID');
      return;
    }

    try {
      setValidating(true);
      setError('');
      setValidationResult(null);

      const request: TicketValidationRequest = {
        id: ticketId,
        method: method,
      };

      const response = await validationApi.validateTicket(request);
      setValidationResult(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error validating ticket');
      // Mock validation for demo
      setValidationResult({
        id: '1',
        status: Math.random() > 0.3 ? 'VALID' : 'INVALID',
        validationMethod: method,
        ticket: {
          id: ticketId,
          status: 'PURCHASED',
          ticketType: {
            id: '1',
            name: 'General Admission',
            description: 'Standard entry ticket',
            price: 50.00,
            eventId: '1',
          },
          purchaser: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            roles: [],
          },
        },
      });
    } finally {
      setValidating(false);
    }
  };

  const handleReset = () => {
    setTicketId('');
    setValidationResult(null);
    setError('');
  };

  const getResultIcon = (status: string) => {
    switch (status) {
      case 'VALID':
        return <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />;
      case 'INVALID':
        return <Error sx={{ fontSize: 64, color: 'error.main' }} />;
      case 'EXPIRED':
        return <Warning sx={{ fontSize: 64, color: 'warning.main' }} />;
      default:
        return null;
    }
  };

  const getResultColor = (status: string) => {
    switch (status) {
      case 'VALID':
        return 'success';
      case 'INVALID':
        return 'error';
      case 'EXPIRED':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (!hasRole('STAFF')) {
    return (
      <Layout>
        <Typography variant="h4" color="error">
          Access Denied
        </Typography>
        <Typography>
          You need STAFF role to access ticket validation.
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Ticket Validation
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Validate Ticket
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Validation Method</InputLabel>
                <Select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as 'QR_SCAN' | 'MANUAL')}
                >
                  <MenuItem value="QR_SCAN">QR Code Scan</MenuItem>
                  <MenuItem value="MANUAL">Manual Entry</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Ticket ID"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Enter or scan ticket ID"
                sx={{ mb: 2 }}
                onKeyPress={(e) => e.key === 'Enter' && handleValidation()}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleValidation}
                  disabled={validating || !ticketId.trim()}
                  startIcon={<QrCodeScanner />}
                  fullWidth
                >
                  {validating ? 'Validating...' : 'Validate Ticket'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={validating}
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {validationResult && (
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Validation Result
                </Typography>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  {getResultIcon(validationResult.status)}
                  <Typography 
                    variant="h4" 
                    color={`${getResultColor(validationResult.status)}.main`}
                    sx={{ mt: 1, fontWeight: 'bold' }}
                  >
                    {validationResult.status}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Ticket Details
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ticket ID
                  </Typography>
                  <Typography variant="body1">
                    {validationResult.ticket.id}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ticket Type
                  </Typography>
                  <Typography variant="body1">
                    {validationResult.ticket.ticketType.name}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body1">
                    ${validationResult.ticket.ticketType.price.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Purchaser
                  </Typography>
                  <Typography variant="body1">
                    {validationResult.ticket.purchaser.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {validationResult.ticket.purchaser.email}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Validation Method
                  </Typography>
                  <Typography variant="body1">
                    {validationResult.validationMethod.replace('_', ' ')}
                  </Typography>
                </Box>

                {validationResult.status === 'VALID' && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    ✓ Ticket is valid. Allow entry.
                  </Alert>
                )}

                {validationResult.status === 'INVALID' && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    ✗ Ticket is invalid. Deny entry.
                  </Alert>
                )}

                {validationResult.status === 'EXPIRED' && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    ⚠ Ticket has expired. Deny entry.
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {!validationResult && (
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary' 
              }}>
                <QrCodeScanner sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Ready to Validate
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Enter a ticket ID and click validate to check ticket status
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default TicketValidation;