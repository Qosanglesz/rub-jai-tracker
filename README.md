# Rub Jai Tracker

A personal finance tracking application that helps you monitor income, expenses, transactions, and savings goals. Built with a Vue 3 frontend and a NestJS REST API backend backed by PostgreSQL.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Start the Database](#2-start-the-database)
  - [3. Run the Backend](#3-run-the-backend)
  - [4. Run the Frontend](#4-run-the-frontend)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [License](#license)

---

## Features

- User registration and login with JWT authentication
- Dashboard with monthly income, expense, and balance summary
- Transaction management (create, read, update, delete)
- Category management with INCOME / EXPENSE types
- Savings goals tracking with progress indicators
- Analytics composable for filtered financial summaries
- Responsive UI using Tailwind CSS v4

---

## Tech Stack

### Frontend

| Technology | Description |
|---|---|
| Vue 3 | UI framework with Composition API |
| Vite | Build tool and dev server |
| TypeScript | Static typing |
| Pinia | State management |
| Vue Router 4 | Client-side routing |
| TanStack Query (vue-query) | Server state, caching, and mutations |
| Axios | HTTP client |
| Tailwind CSS v4 | Utility-first styling |
| Lucide Vue Next | Icon library |
| vue-sonner | Toast notifications |

### Backend

| Technology | Description |
|---|---|
| NestJS 11 | Node.js framework |
| TypeScript | Static typing |
| TypeORM | ORM for database access |
| PostgreSQL 15 | Relational database |
| Passport + JWT | Authentication strategy |
| bcrypt | Password hashing |
| class-validator | Request DTO validation |
| Swagger | Auto-generated API documentation |
| Docker Compose | Local database container |

---

## Project Structure

```
rub-jai-tracker/
├── backend-nestjs/        # NestJS API server
│   ├── src/
│   │   ├── auth/          # Auth module (register, login, JWT guard)
│   │   ├── users/         # User entity and service
│   │   ├── transactions/  # Transaction CRUD
│   │   ├── categories/    # Category CRUD
│   │   ├── goals/         # Savings goals CRUD
│   │   └── analytics/     # Monthly summary analytics
│   └── docker-compose.yml # PostgreSQL container definition
│
└── frontend-vue/          # Vue 3 SPA
    └── src/
        ├── api/           # Axios client configuration
        ├── composables/   # TanStack Query hooks
        │   ├── useAnalytics.ts
        │   ├── useCategories.ts
        │   ├── useTransactions.ts
        │   └── useGoals.ts
        ├── stores/        # Pinia stores (auth)
        ├── types/         # TypeScript interfaces and types
        ├── views/         # Page-level Vue components
        └── router/        # Vue Router configuration
```

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Docker and Docker Compose

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rub-jai-tracker.git
cd rub-jai-tracker
```

### 2. Start the Database

```bash
cd backend-nestjs
docker compose up -d
```

This starts a PostgreSQL 15 container named `rubjai_postgres` on port `5432` with persistent volume storage.

### 3. Run the Backend

```bash
cd backend-nestjs
npm install
cp .env.example .env   # or create .env manually (see Environment Variables section)
npm run start:dev
```

The API will be available at `http://localhost:3000`.  
Swagger documentation is available at `http://localhost:3000/api`.

### 4. Run the Frontend

In a separate terminal:

```bash
cd frontend-vue
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend-nestjs/.env`)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=password123
DB_NAME=rubjaidb

JWT_SECRET=your-secret-key
PORT=3000
```

### Frontend (`frontend-vue/.env`)

```env
VITE_API_URL=http://localhost:3000
```

---

## API Overview

All protected routes require a `Bearer` token in the `Authorization` header.

| Module | Endpoint | Description |
|---|---|---|
| Auth | `POST /auth/register` | Register a new user |
| Auth | `POST /auth/login` | Login and receive JWT |
| Transactions | `GET /transactions` | List transactions |
| Transactions | `POST /transactions` | Create a transaction |
| Transactions | `PATCH /transactions/:id` | Update a transaction |
| Transactions | `DELETE /transactions/:id` | Delete a transaction |
| Categories | `GET /categories` | List categories |
| Categories | `POST /categories` | Create a category |
| Goals | `GET /goals` | List savings goals |
| Goals | `POST /goals` | Create a savings goal |
| Goals | `PATCH /goals/:id` | Update a savings goal |
| Goals | `DELETE /goals/:id` | Delete a savings goal |
| Analytics | `GET /analytics/summary` | Monthly financial summary |

Full interactive documentation is available via Swagger at `/api` when the server is running.

---

## License

This project is for educational and personal use. See [LICENSE](LICENSE) for details.
