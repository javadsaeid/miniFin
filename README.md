# miniFin

miniFin is a Spring Boot REST API for a lightweight banking system with users, roles, accounts, and transactions. It uses JWT authentication, MySQL for persistence, and SMTP for email notifications.

## Requirements

- Java 21
- Maven 3.9+
- MySQL 8+
- SMTP credentials (for password reset and notifications)

## Configuration

Configuration is loaded from environment variables or a local `.env` file (see `src/main/resources/application.properties`).

Required variables:

- `PORT`
- `LOCAL_DB_URL`
- `LOCAL_DB_USERNAME`
- `LOCAL_DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_TIME`
- `MAIL_USER`
- `MAIL_PASS`

Optional (in `application.properties`):

- `password.reset.link` (default: `http://localhost:8080/reset-password?code=`)

## Run

```bash
./mvnw spring-boot:run
```

The API will start on `http://localhost:${PORT}`.

## Authentication

All endpoints except `/api/auth/**` require a JWT bearer token:

```
Authorization: Bearer <token>
```

## Endpoints

Base URL: `/api`

### Auth (`/api/auth`) — Public

- `POST /register` — Register a new user
- `POST /login` — Login and obtain JWT
- `POST /forgot-password` — Send password reset code to email
- `POST /reset-password` — Reset password using code

### Users (`/api/users`) — Authenticated

- `GET /` — List users (ADMIN only)  
  Query params: `page` (default 0), `size` (default 50)
- `GET /me` — Get my profile
- `PUT /update-password` — Update my password
- `PUT /profile-picture` — Upload profile picture (multipart form)  
  Form field: `file`

### Accounts (`/api/accounts`) — Authenticated

- `GET /me` — Get my accounts
- `DELETE /close/{accountNumber}` — Close account

### Transactions (`/api/transactions`) — Authenticated

- `GET /{accountNumber}` — Get my transactions for account  
  Query params: `page` (default 0), `size` (default 50)
- `POST /` — Create a transaction

### Roles (`/api/roles`) — ADMIN only

- `POST /` — Create role
- `PUT /` — Update role
- `GET /` — List roles
- `DELETE /{id}` — Delete role

### Audit Dashboard (`/api/audit`) — ADMIN or AUDITOR

- `GET /totals` — System totals summary
- `GET /users?email=...` — Find user by email
- `GET /accounts?accountNumber=...` — Find account by account number
- `GET /transactions/by-accountNumber?accountNumber=...` — Find transactions by account number
- `GET /transactions/by-id?id=...` — Find transaction by id
