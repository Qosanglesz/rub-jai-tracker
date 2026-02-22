# Rub Jai Tracker - Backend

This backend is built with NestJS, TypeORM, and PostgreSQL. It provides the API for user authentication, transaction tracking, saving goals, and dashboard analytics.

## Prerequisites
- Node.js (v18+)
- Docker Desktop (for PostgreSQL)
- npm or yarn

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Database**
   Make sure Docker Desktop is open and running, then start the PostgreSQL container:
   ```bash
   docker-compose down -v  # Optional: Clears old volumes if you have connection errors
   docker-compose up -d
   ```

3. **Start the NestJS API Server**
   ```bash
   npm run start:dev
   ```

The backend server will start at `http://localhost:3000/api`.
You can view the interactive Swagger API documentation by visiting: `http://localhost:3000/api`

*Note: If you ever see a "password authentication failed" error, it usually means your local Docker has cached an old database password. Run `docker-compose down -v` then `docker-compose up -d` again.*
