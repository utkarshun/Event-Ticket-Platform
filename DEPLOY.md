# Deployment Guide

## Prerequisites
- Docker
- Docker Compose

## Steps to Deploy

1.  **Navigate to the project directory:**
    ```bash
    cd ticket-platform
    ```

2.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```

3.  **Access the application:**
    - The backend API will be available at: `http://localhost:8081`
    - Keycloak: `http://localhost:9090`
    - Adminer (Database Admin): `http://localhost:8888`

## Configuration
- The backend connects to the PostgreSQL database at `jdbc:postgresql://db:5432/ticketdb`.
- Keycloak is configured as the OAuth2 resource server at `http://keycloak:8080/realms/event-ticket-platform`.

## Troubleshooting
- If services fail to start, check the logs:
    ```bash
    docker-compose logs -f
    ```
- Ensure ports 8081, 5433, 8888, and 9090 are not in use on your host machine.
