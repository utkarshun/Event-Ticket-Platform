import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
} from '@mui/material';
import { Event } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';

const LoginPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!token.trim()) {
      setError('Please enter a valid JWT token');
      return;
    }

    try {
      login(token);
      navigate('/');
      setError('');
    } catch (err) {
      setError('Invalid token format. Please check your JWT token.');
    }
  };

  // Sample tokens for different roles (for demo purposes)
  const sampleTokens = {
    organizer: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4ub3JnYW5pemVyQGV4YW1wbGUuY29tIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIlJPTEVfT1JHQU5JWkVSIl19LCJpYXQiOjE1MTYyMzkwMjJ9.demoSignature123',
    staff: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDEiLCJuYW1lIjoiSmFuZSBTdGFmZiIsImVtYWlsIjoiamFuZS5zdGFmZkBleGFtcGxlLmNvbSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJST0xFX1NUQUZGIl19LCJpYXQiOjE1MTYyMzkwMjJ9.demoSignature456',
    user: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDIiLCJuYW1lIjoiQWxpY2UgVXNlciIsImVtYWlsIjoiYWxpY2UudXNlckBleGFtcGxlLmNvbSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6W119LCJpYXQiOjE1MTYyMzkwMjJ9.demoSignature789'
  };

  const handleSampleLogin = (role: 'organizer' | 'staff' | 'user') => {
    setToken(sampleTokens[role]);
  };

  return (
    <Layout maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Event sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="JWT Token"
                variant="outlined"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                multiline
                rows={4}
                placeholder="Paste your JWT token here..."
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                size="large"
                sx={{ mb: 2 }}
              >
                Login
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
              Demo Tokens (for testing):
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleSampleLogin('organizer')}
              >
                Login as Organizer
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleSampleLogin('staff')}
              >
                Login as Staff
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleSampleLogin('user')}
              >
                Login as User
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default LoginPage;