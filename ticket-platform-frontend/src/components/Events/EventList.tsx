import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  Chip,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  CalendarMonth,
  AttachMoney,
  Search,
} from '@mui/icons-material';
import { eventApi } from '../../services/api';
import { Event } from '../../types';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [searchQuery]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventApi.getPublishedEvents({ 
        q: searchQuery || undefined 
      });
      setEvents(response.data.content || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchEvents();
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

  return (
    <Layout>
      <Typography variant="h3" component="h1" gutterBottom>
        Discover Events
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Search events..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <IconButton 
          onClick={handleSearch}
          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <Search />
        </IconButton>
      </Box>

      {loading ? (
        <Typography>Loading events...</Typography>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
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
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.venue}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonth sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(event.eventStart)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Sales: {formatDate(event.salesStart)} - {formatDate(event.salesEnd)}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => navigate(`/events/${event.id}/tickets`)}
                  >
                    Buy Tickets
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && events.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Try a different search term' : 'Check back later for upcoming events'}
          </Typography>
        </Box>
      )}
    </Layout>
  );
};

export default EventList;