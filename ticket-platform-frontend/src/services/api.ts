import axios, { AxiosResponse } from 'axios';
import { Event, Ticket, CreateEventRequest, UpdateEventRequest, TicketValidationRequest, TicketValidationResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8085/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const eventApi = {
  // Public endpoints
  getPublishedEvents: (params?: { q?: string; page?: number; size?: number }) =>
    apiClient.get<any>('/published-events', { params }),
  
  getPublishedEvent: (id: string) =>
    apiClient.get<Event>(`/published-events/${id}`),

  // Organizer endpoints (require ORGANIZER role)
  createEvent: (event: CreateEventRequest) =>
    apiClient.post<Event>('/events', event),
  
  getEvents: (params?: { page?: number; size?: number }) =>
    apiClient.get<any>('/events', { params }),
  
  getEvent: (id: string) =>
    apiClient.get<Event>(`/events/${id}`),
  
  updateEvent: (id: string, event: UpdateEventRequest) =>
    apiClient.put<Event>(`/events/${id}`, event),
  
  deleteEvent: (id: string) =>
    apiClient.delete<void>(`/events/${id}`),

  // Ticket types for published events
  getPublishedEventTicketTypes: (eventId: string) =>
    apiClient.get<any>(`/published-events/${eventId}/ticket-types`),
};

export const ticketApi = {
  // User endpoints (authenticated)
  getUserTickets: (params?: { page?: number; size?: number }) =>
    apiClient.get<any>('/tickets', { params }),
  
  getTicket: (id: string) =>
    apiClient.get<Ticket>(`/tickets/${id}`),
  
  getTicketQR: (id: string) =>
    apiClient.get<Blob>(`/tickets/${id}/qr-codes`, { responseType: 'blob' }),
  
  // Purchase ticket
  purchaseTicket: (eventId: string, ticketTypeId: string) =>
    apiClient.post<void>(`/events/${eventId}/ticket-types/${ticketTypeId}/tickets`),
};

export const validationApi = {
  // Staff endpoints (require STAFF role)
  validateTicket: (request: TicketValidationRequest) =>
    apiClient.post<TicketValidationResponse>('/ticket-validations', request),
};

export default apiClient;