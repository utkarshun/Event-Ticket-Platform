import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  ConfirmationNumber,
  QrCode,
  Event as EventIcon,
  LocationOn,
} from '@mui/icons-material';
import { ticketApi } from '../../services/api';
import { Ticket } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../Layout/Layout';

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrDialog, setQrDialog] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketApi.getUserTickets();
      setTickets(response.data.content || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Mock data for demonstration
      setTickets([
        {
          id: '1',
          status: 'PURCHASED',
          ticketType: {
            id: '1',
            name: 'General Admission',
            description: 'Standard entry ticket',
            price: 50.00,
            eventId: '1',
          },
          purchaser: user!,
        },
        {
          id: '2',
          status: 'PURCHASED',
          ticketType: {
            id: '2',
            name: 'VIP',
            description: 'Premium experience',
            price: 150.00,
            eventId: '2',
          },
          purchaser: user!,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = async (ticket: Ticket) => {
    try {
      const response = await ticketApi.getTicketQR(ticket.id);
      const blob = new Blob([response.data], { type: 'image/png' });
      const qrUrl = URL.createObjectURL(blob);
      setQrCode(qrUrl);
      setSelectedTicket(ticket);
      setQrDialog(true);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      // Mock QR code for demo
      setQrCode('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJibGFjayI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+');
      setSelectedTicket(ticket);
      setQrDialog(true);
    }
  };

  const handleCloseQR = () => {
    setQrDialog(false);
    setQrCode(null);
    setSelectedTicket(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PURCHASED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <Layout>
        <Typography variant="h4" color="error">
          Please login to view your tickets
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h3" component="h1" gutterBottom>
        My Tickets
      </Typography>

      {loading ? (
        <Typography>Loading tickets...</Typography>
      ) : (
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={4} key={ticket.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={ticket.status} 
                      color={getStatusColor(ticket.status) as any}
                      size="small" 
                    />
                  </Box>
                  
                  <Typography variant="h5" component="h2" gutterBottom>
                    {ticket.ticketType.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {ticket.ticketType.description}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      ${ticket.ticketType.price.toFixed(2)}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Ticket ID: {ticket.id}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<QrCode />}
                    onClick={() => handleShowQR(ticket)}
                    disabled={ticket.status !== 'PURCHASED'}
                  >
                    Show QR
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && tickets.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <ConfirmationNumber sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No tickets found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You haven't purchased any tickets yet.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => window.location.href = '/events'}
          >
            Browse Events
          </Button>
        </Box>
      )}

      <Dialog open={qrDialog} onClose={handleCloseQR} maxWidth="sm" fullWidth>
        <DialogTitle>
          Ticket QR Code
          {selectedTicket && (
            <Typography variant="subtitle1" color="text.secondary">
              {selectedTicket.ticketType.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          {qrCode && (
            <Box>
              <img 
                src={qrCode} 
                alt="Ticket QR Code" 
                style={{ maxWidth: '100%', height: 'auto', marginBottom: 16 }}
              />
              <Typography variant="body2" color="text.secondary">
                Present this QR code at the event entrance
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MyTickets;