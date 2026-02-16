# Ticket Platform Frontend

A beautiful, modern React frontend for the Ticket Platform event management system.

## Features

### 🎫 **For Users**
- Browse and search public events
- Purchase tickets with secure authentication
- View purchased tickets with QR codes
- Responsive design for all devices

### 🎪 **For Event Organizers**
- Create and manage events
- Set ticket sales periods
- Track event status (Draft, Published, Cancelled, Completed)
- Full CRUD operations for events

### 🛡️ **For Staff**
- Validate tickets using QR codes or manual entry
- Real-time validation results
- Ticket holder information display

## Technology Stack

- **React 19** with TypeScript
- **Material-UI (MUI)** for beautiful components
- **React Router** for navigation
- **Axios** for API communication
- **JWT Authentication** with role-based access control

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd ticket-platform-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080`

## Authentication

The application uses JWT tokens for authentication. For testing, you can use the demo login buttons on the login page:

### Demo Users:
- **Organizer**: Can create and manage events
- **Staff**: Can validate tickets at events
- **User**: Can browse and purchase tickets

## Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Login components
│   ├── Events/          # Event browsing and details
│   ├── Home/            # Homepage
│   ├── Layout/          # Header and layout components
│   ├── Organizer/       # Event management dashboard
│   ├── Staff/           # Ticket validation tools
│   └── Tickets/         # User ticket management
├── contexts/            # React contexts (Auth)
├── services/            # API service layer
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

## Features by Role

### 🌐 **Public (No Authentication)**
- Browse published events
- Search events
- View event details
- Access to login page

### 👤 **Authenticated Users**
- Purchase tickets
- View purchased tickets
- Generate QR codes for tickets
- Access user dashboard

### 🎪 **Event Organizers (ROLE_ORGANIZER)**
- Create new events
- Edit existing events
- Delete events
- Manage event status (Draft → Published)
- View organizer dashboard

### 🛡️ **Staff Members (ROLE_STAFF)**
- Access ticket validation portal
- Scan or manually enter ticket IDs
- View validation results
- See ticket holder information

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Security Features

- **JWT Token Management**: Secure token storage and refresh
- **Role-based Access Control**: Different UI based on user roles
- **Protected Routes**: Authentication required for sensitive pages
- **Automatic Logout**: Token expiry handling

---

**Happy Event Management! 🎉**
