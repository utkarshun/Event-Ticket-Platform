import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Event,
  ConfirmationNumber,
  Security,
  Dashboard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../Layout/Layout';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const features = [
    {
      icon: <Event sx={{ fontSize: 48 }} />,
      title: 'Discover Events',
      description: 'Browse and search for exciting events happening near you',
      action: 'Browse Events',
      onClick: () => navigate('/events'),
    },
    {
      icon: <ConfirmationNumber sx={{ fontSize: 48 }} />,
      title: 'Purchase Tickets',
      description: 'Buy tickets securely with instant confirmation and QR codes',
      action: 'View My Tickets',
      onClick: () => navigate('/my-tickets'),
      requireAuth: true,
    },
    {
      icon: <Dashboard sx={{ fontSize: 48 }} />,
      title: 'Organize Events',
      description: 'Create and manage your own events with our organizer tools',
      action: 'Organizer Dashboard',
      onClick: () => navigate('/organizer/dashboard'),
      requireRole: 'ORGANIZER',
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Ticket Validation',
      description: 'Validate tickets at event entrances with staff tools',
      action: 'Validation Portal',
      onClick: () => navigate('/staff/validation'),
      requireRole: 'STAFF',
    },
  ];

  const visibleFeatures = features.filter(feature => {
    if (feature.requireRole && !hasRole(feature.requireRole)) return false;
    if (feature.requireAuth && !user) return false;
    return true;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          px: 4,
          borderRadius: 2,
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to TicketPlatform
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Your one-stop destination for event tickets and management
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            backdropFilter: 'blur(10px)',
          }}
          onClick={() => navigate('/events')}
        >
          Explore Events
        </Button>
      </Box>

      {/* Features Section */}
      <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
        What You Can Do
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {visibleFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  onClick={feature.onClick}
                  size="large"
                >
                  {feature.action}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* User Status Section */}
      {user ? (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your roles: {user.roles.length > 0 ? user.roles.join(', ') : 'Standard User'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => navigate('/my-tickets')}>
              My Tickets
            </Button>
            {hasRole('ORGANIZER') && (
              <Button variant="outlined" onClick={() => navigate('/organizer/dashboard')}>
                Manage Events
              </Button>
            )}
            {hasRole('STAFF') && (
              <Button variant="outlined" onClick={() => navigate('/staff/validation')}>
                Validate Tickets
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Sign in to purchase tickets, manage events, and access all platform features
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            Sign In
          </Button>
        </Box>
      )}
    </Layout>
  );
};

export default HomePage;