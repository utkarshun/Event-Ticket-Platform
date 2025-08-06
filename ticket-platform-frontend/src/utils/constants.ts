export const API_ENDPOINTS = {
  PUBLISHED_EVENTS: '/published-events',
  EVENTS: '/events',
  TICKETS: '/tickets',
  TICKET_VALIDATIONS: '/ticket-validations',
} as const;

export const USER_ROLES = {
  ORGANIZER: 'ROLE_ORGANIZER',
  STAFF: 'ROLE_STAFF',
  USER: 'ROLE_USER',
} as const;

export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export const TICKET_STATUS = {
  PURCHASED: 'PURCHASED',
  CANCELLED: 'CANCELLED',
} as const;

export const VALIDATION_STATUS = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  EXPIRED: 'EXPIRED',
} as const;