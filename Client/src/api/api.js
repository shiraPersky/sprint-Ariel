// Client/src/api/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Comes from .env file
  withCredentials: true, // Set to true only if you use cookies or sessions
});

export default api;
