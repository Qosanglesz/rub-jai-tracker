import axios from 'axios';

// Create an Axios instance configured to talk to our NestJS backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // IMPORTANT: Allows cookies (like our JWT) to be sent automatically
});

// Response interceptor to handle global errors (e.g., catching 401s if JWT expires)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Junior Note: Here we might redirect to login if we detect a 401 Unauthorized
    // and they aren't already on the login page. We'll handle state clears in the store though.
    return Promise.reject(error);
  }
);

export default apiClient;
