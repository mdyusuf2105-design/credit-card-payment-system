# Credit Card Payment System

A full-stack credit card payment system built with React, Django REST Framework, FastAPI, MySQL, and Docker.

## Features

- User registration and JWT authentication
- Secure password hashing
- Protected routes
- Credit/debit card management
- Masked card details with last four digits
- Payment creation and processing
- Simulated SUCCESS/FAILED payment results
- Transaction history
- Transaction filtering by status, amount, and date
- Admin dashboard
- Daily transaction summary
- CSV transaction export
- Admin activity logging
- Swagger/OpenAPI documentation
- Dockerized development environment
- Automated backend tests

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Django
- Django REST Framework
- Simple JWT
- FastAPI
- SQLAlchemy
- Pydantic

### Database

- MySQL 8.4

### DevOps

- Docker
- Docker Compose

## Project Structure

```text
credit-card-payment-system/
├── backend/
│   ├── django_backend/
│   │   ├── accounts/
│   │   ├── cards/
│   │   ├── transactions/
│   │   ├── django_backend/
│   │   ├── manage.py
│   │   └── requirements.txt
│   │
│   ├── fastapi_backend/
│   │   ├── routers/
│   │   ├── tests/
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── main.py
│   │   └── requirements.txt
│   │
│   ├── frontend/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── docker-compose.yml
│   └── .env.example
│
└── .gitignore