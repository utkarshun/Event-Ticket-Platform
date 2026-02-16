# Event Ticket Platform

A modern, full-stack event ticketing platform built with Spring Boot and React. This application provides a seamless experience for event organizers to manage events and for users to browse and purchase tickets.

## 🚀 Features

### For Users
- 🎫 **Browse Events**: Discover public events with a rich UI.
- 🛒 **Purchase Tickets**: Secure ticket booking flow.
- 📱 **QR Code Tickets**: View purchased tickets with QR codes for easy validation.
- 🔒 **Secure Account**: User authentication and order history.

### For Organizers
- 📅 **Event Management**: Create, edit, and publish events.
- 📊 **Dashboard**: Track sales and event status (Draft, Published, Cancelled).
- 🛠️ **Management Tools**: Full CRUD capabilities for event handling.

### For Staff
- 🛡️ **Ticket Validation**: Validate attendee tickets via QR code scanning or manual ID entry.
- ✅ **Real-time Check-in**: Instant validation results and attendee lookups.

## 🏗️ Technical Architecture

The project is structured into two main components:

### Backend (`/backend`)
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 21
- **Database**: PostgreSQL (Production), H2 (Development/Test)
- **Authentication**: OAuth2 Resource Server (Keycloak integration)
- **Tools**: Lombok, MapStruct, Docker, Maven

### Frontend (`/frontend`)
- **Framework**: React 19
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context / Hooks
- **Routing**: React Router

## 🛠️ Getting Started

### Prerequisites
- Java 21+
- Node.js v18+
- Docker & Docker Compose

### Fast Start with Docker (Recommended)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/utkarshun/Event-Ticket-Platform.git
    cd Event-Ticket-Platform
    ```

2.  **Start the services (Database, Keycloak, Backend)**
    ```bash
    cd backend
    docker-compose up -d
    ```

3.  **Start the Frontend**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```

4.  **Access the Application**
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:8081`
    - Keycloak: `http://localhost:9090`
    - Database Admin (Adminer): `http://localhost:8888`

### Manual Setup

#### Backend
1.  Navigate to `backend/`
2.  Configure database settings in `src/main/resources/application.properties` if not using Docker.
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```

#### Frontend
1.  Navigate to `frontend/`
2.  Install dependencies: `npm install`
3.  Start the dev server: `npm start`

## 🔑 Default Credentials (Development)

- **Keycloak Admin**: `admin` / `admin`
- **Postgres DB**: `postgres` / `changemeinprod!`

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License

[MIT License](LICENSE)