export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface Event {
  id: string;
  name: string;
  venue: string;
  eventStart: string;
  eventEnd: string;
  salesStart: string;
  salesEnd: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  organizer?: User;
}

export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  totalAvailable?: number;
  eventId: string;
}

export interface Ticket {
  id: string;
  status: 'PURCHASED' | 'CANCELLED';
  ticketType: TicketType;
  purchaser: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export interface CreateEventRequest {
  name: string;
  venue: string;
  start: string;
  end: string;
  salesStart: string;
  salesEnd: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  ticketTypes: any[];
}

export interface UpdateEventRequest {
  name: string;
  venue: string;
  start: string;
  end: string;
  salesStart: string;
  salesEnd: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  ticketTypes?: any[];
}

export interface TicketValidationRequest {
  id: string;
  method: 'QR_SCAN' | 'MANUAL';
}

export interface TicketValidationResponse {
  id: string;
  status: 'VALID' | 'INVALID' | 'EXPIRED';
  validationMethod: 'QR_SCAN' | 'MANUAL';
  ticket: Ticket;
}