import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Event as EventIcon,
  Visibility,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { eventApi } from '../../services/api';
import { Event, CreateEventRequest, UpdateEventRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../Layout/Layout';

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { hasRole } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    eventStart: dayjs(),
    eventEnd: dayjs().add(2, 'hours'),
    salesStart: dayjs(),
    salesEnd: dayjs().add(1, 'week'),
  });

  useEffect(() => {
    if (hasRole('ORGANIZER')) {
      fetchEvents();
    }
  }, [hasRole]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventApi.getEvents();
      setEvents(response.data.content || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    // Validate form data
    if (!formData.name.trim()) {
      alert('Event name is required');
      return;
    }
    if (!formData.venue.trim()) {
      alert('Venue is required');
      return;
    }
    if (formData.eventStart.isAfter(formData.eventEnd)) {
      alert('Event start time must be before end time');
      return;
    }
    if (formData.salesStart.isAfter(formData.salesEnd)) {
      alert('Sales start time must be before sales end time');
      return;
    }
    if (formData.salesEnd.isAfter(formData.eventStart)) {
      alert('Sales must end before the event starts');
      return;
    }

    try {
      const eventData: CreateEventRequest = {
        name: formData.name,
        venue: formData.venue,
        start: formData.eventStart.toISOString(),
        end: formData.eventEnd.toISOString(),
        salesStart: formData.salesStart.toISOString(),
        salesEnd: formData.salesEnd.toISOString(),
        status: 'DRAFT',
        ticketTypes: [],
      };

      console.log('Sending event data:', JSON.stringify(eventData, null, 2));

      if (editingEvent) {
        await eventApi.updateEvent(editingEvent.id, eventData);
      } else {
        await eventApi.createEvent(eventData);
      }

      fetchEvents();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving event:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert(`Error saving event: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      venue: event.venue,
      eventStart: dayjs(event.eventStart),
      eventEnd: dayjs(event.eventEnd),
      salesStart: dayjs(event.salesStart),
      salesEnd: dayjs(event.salesEnd),
    });
    setDialogOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventApi.deleteEvent(eventId);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
    setFormData({
      name: '',
      venue: '',
      eventStart: dayjs(),
      eventEnd: dayjs().add(2, 'hours'),
      salesStart: dayjs(),
      salesEnd: dayjs().add(1, 'week'),
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (!hasRole('ORGANIZER')) {
    return (
      <Layout>
        <Typography variant="h4" color="error">
          Access Denied
        </Typography>
        <Typography>
          You need ORGANIZER role to access this page.
        </Typography>
      </Layout>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1">
            My Events
          </Typography>
        </Box>

        {loading ? (
          <Typography>Loading events...</Typography>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={event.status} 
                        color={getStatusColor(event.status) as any}
                        size="small" 
                      />
                    </Box>
                    
                    <Typography variant="h5" component="h2" gutterBottom>
                      {event.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {event.venue}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <strong>Event:</strong> {formatDate(event.eventStart)}
                    </Typography>
                    
                    <Typography variant="body2">
                      <strong>Sales:</strong> {formatDate(event.salesStart)} - {formatDate(event.salesEnd)}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <IconButton onClick={() => handleEditEvent(event)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteEvent(event.id)} color="error">
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setDialogOpen(true)}
        >
          <Add />
        </Fab>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Event Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <DateTimePicker
                    label="Event Start"
                    value={formData.eventStart}
                    onChange={(newValue: Dayjs | null) => 
                      setFormData({ ...formData, eventStart: newValue || dayjs() })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker
                    label="Event End"
                    value={formData.eventEnd}
                    onChange={(newValue: Dayjs | null) => 
                      setFormData({ ...formData, eventEnd: newValue || dayjs() })
                    }
                  />
                </Grid>
              </Grid>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DateTimePicker
                    label="Sales Start"
                    value={formData.salesStart}
                    onChange={(newValue: Dayjs | null) => 
                      setFormData({ ...formData, salesStart: newValue || dayjs() })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker
                    label="Sales End"
                    value={formData.salesEnd}
                    onChange={(newValue: Dayjs | null) => 
                      setFormData({ ...formData, salesEnd: newValue || dayjs() })
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleCreateEvent} variant="contained">
              {editingEvent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </LocalizationProvider>
  );
};

export default OrganizerDashboard;