import axios from 'axios';

// Axios instance configured with the base URL of your backend API.
// When running locally with Expo, replace the URL below with your machine's
// IP address followed by the port of the backend server.  For example:
//   http://192.168.0.100:3000/api
// You can also expose your backend using tools like ngrok when testing on
// physical devices.
const API_URL = 'http://192.168.1.8:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;