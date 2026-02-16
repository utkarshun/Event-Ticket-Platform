import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      try {
        // Decode JWT token to get user info (simplified)
        const parts = savedToken.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid JWT format');
        }
        const payload = JSON.parse(atob(parts[1]));
        const userRoles = payload.realm_access?.roles || [];
        
        setUser({
          id: payload.sub,
          name: payload.name || 'User',
          email: payload.email || 'user@example.com',
          roles: userRoles,
        });
        setToken(savedToken);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = (newToken: string) => {
    try {
      const parts = newToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      const payload = JSON.parse(atob(parts[1]));
      const userRoles = payload.realm_access?.roles || [];
      
      const userData: User = {
        id: payload.sub,
        name: payload.name || 'User',
        email: payload.email || 'user@example.com',
        roles: userRoles,
      };

      setUser(userData);
      setToken(newToken);
      localStorage.setItem('authToken', newToken);
    } catch (error) {
      console.error('Error parsing token:', error);
      throw error; // Re-throw to handle in UI
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const hasRole = (role: string) => {
    return user?.roles?.includes(`ROLE_${role}`) || false;
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};