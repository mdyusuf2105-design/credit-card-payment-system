# Credit Card Payment System

A full-stack credit card payment system built using React, Django REST Framework, FastAPI, MySQL, and Docker Compose. Payments use a simulated processing flow and do not require a real payment gateway.

## Features

- User registration and JWT authentication
- Password hashing and protected API routes
- Card management with masked card details
- Payment creation and simulated processing
- Transaction history and filtering by status, amount, and date
- Admin dashboard and daily transaction summaries
- CSV transaction export
- Admin activity logging
- FastAPI Swagger/OpenAPI documentation
- Dockerized development environment
- Automated Django and FastAPI tests

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Django, Django REST Framework, Simple JWT, FastAPI, SQLAlchemy, Pydantic
- **Database:** MySQL 8.4
- **Development:** Docker, Docker Compose, pytest

## Project Structure

credit-card-payment-system/
├── README.md
├── Credit-Card-Payment-System.postman_collection.json
├── credit-card-payment-db.sql
├── submission/
│   └── screenshots/
└── backend/
    ├── django_backend/
    ├── fastapi_backend/
    ├── frontend/
    └── docker-compose.yml


## Prerequisites

- Docker Desktop with Docker Compose
- Node.js and npm if running the frontend outside Docker
- Git

## Setup and Run

1. Clone or open the project repository.
2. Configure the environment variables required by `backend/docker-compose.yml`. Use `backend/.env.example` as a reference if available.
3. Open a terminal and enter the backend directory:

   ```bash
   cd backend
   ```

4. Build and start the services:

   ```bash
   docker compose up --build -d
   ```

5. Check service status:

   ```bash
   docker compose ps
   ```

## Local Service URLs

- **Frontend development server:** `http://localhost:5174` when running the local Vite server; Docker may expose a different port.
- **Django API:** `http://localhost:8000`
- **FastAPI:** `http://localhost:8001`
- **FastAPI Swagger documentation:** `http://localhost:8001/docs`

The exact frontend port depends on the active development server and Docker configuration.

## Running Tests

From the `backend` directory:

```bash
docker compose exec django python manage.py test
docker compose exec fastapi pytest -q
npm --prefix frontend run build
```

The verified results during project validation were 9 passing Django tests, 4 passing FastAPI tests, and a successful frontend production build.

## Database Backup and Restore

A MySQL dump is included at `credit-card-payment-db.sql`.

To restore it, first ensure the MySQL service is running and confirm the database name and credentials in your environment configuration. Import the dump using the configured MySQL account and database.

Keep database passwords and other secrets out of source control.

## API Testing

Import `Credit-Card-Payment-System.postman_collection.json` into Postman.

The collection includes request groups for:

- Authentication
- Cards
- Payments
- Transactions
- Admin dashboard

Authenticate first where required and use the appropriate access token for protected requests.

## Submission Evidence

Place application screenshots in `submission/screenshots/`. Recommended evidence includes the dashboard, card management, payment form, transaction history and filters, admin dashboard, and successful API responses.

## Security Notes

- Use simulated payment processing for testing.
- Never store CVVs or plaintext passwords.
- Do not commit real credentials, access tokens, or secret keys.
- Use test data when capturing submission screenshots.

## Development Notes

The project uses Django for user-facing APIs and administration-related functionality, with FastAPI handling payment operations. Refer to the source code and API documentation for the implemented endpoints and behavior.
