import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocationOn,
  CalendarMonth,
  AttachMoney,
  ConfirmationNumber,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi, ticketApi } from '../../services/api';
import { Event, TicketType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../Layout/Layout';

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseDialog, setPurchaseDialog] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventApi.getPublishedEvent(eventId!);
      setEvent(response.data);
      
      // Try to fetch ticket types, fallback to mock data if not available
      try {
        const ticketTypesResponse = await eventApi.getPublishedEventTicketTypes(eventId!);
        setTicketTypes(ticketTypesResponse.data.content || []);
      } catch (ticketTypeError) {
        console.log('Using mock ticket types');
        // Mock ticket types as fallback
        setTicketTypes([
          {
            id: '1',
            name: 'General Admission',
            description: 'Standard entry ticket',
            price: 50.00,
            totalAvailable: 100,
            eventId: eventId || '',
          },
          {
            id: '2', 
            name: 'VIP',
            description: 'VIP experience with premium benefits',
            price: 150.00,
            totalAvailable: 20,
            eventId: eventId || '',
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = (ticketType: TicketType) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedTicketType(ticketType);
    setPurchaseDialog(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedTicketType || !eventId) return;

    try {
      setPurchasing(true);
      await ticketApi.purchaseTicket(eventId, selectedTicketType.id);
      setPurchaseDialog(false);
      setSelectedTicketType(null);
      alert('Ticket purchased successfully!');
      navigate('/my-tickets');
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Error purchasing ticket. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'default';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Typography>Loading event details...</Typography>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <Typography variant="h4" color="error">
          Event not found
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Chip 
              label={event.status} 
              color={getStatusColor(event.status) as any}
              sx={{ mb: 2 }}
            />
            <Typography variant="h3" component="h1" gutterBottom>
              {event.name}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">{event.venue}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarMonth sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body1">
                      <strong>Event:</strong> {formatDate(event.eventStart)} - {formatDate(event.eventEnd)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Ticket Sales:</strong> {formatDate(event.salesStart)} - {formatDate(event.salesEnd)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>
                Ticket Types
              </Typography>
              
              {ticketTypes.map((ticketType) => (
                <Card key={ticketType.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {ticketType.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {ticketType.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="h6" color="primary">
                        ${ticketType.price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<ConfirmationNumber />}
                        onClick={() => handlePurchaseClick(ticketType)}
                        disabled={event.status !== 'PUBLISHED'}
                      >
                        Buy Ticket
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {ticketType.totalAvailable} available
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              {event.status !== 'PUBLISHED' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Tickets are not available for sale yet.
                </Alert>
              )}

              {!user && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Please <Button onClick={() => navigate('/login')}>login</Button> to purchase tickets.
                </Alert>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={purchaseDialog} onClose={() => setPurchaseDialog(false)}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          {selectedTicketType && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedTicketType.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Price: ${selectedTicketType.price.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTicketType.description}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Are you sure you want to purchase this ticket?
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmPurchase}
            variant="contained"
            disabled={purchasing}
          >
            {purchasing ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default EventDetails;