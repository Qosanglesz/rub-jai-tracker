# Rub Jai Tracker - Frontend

This is a modern Vue 3 frontend built using Vite, TailwindCSS, and Pinia for state management. 

## Getting Started

1. **Install Dependencies**
   Ensure you are in the `/frontend-vue` directory, then install packages:
   ```bash
   npm install
   ```

2. **Verify Environment Variables**
   Make sure you have a `.env` file in the root of `frontend-vue` with the following:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
   *(This ensures the frontend can securely talk to the NestJS backend and exchange cookies).*

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

Visit your local host URL (typically `http://localhost:5173`) in your browser to view the application.
