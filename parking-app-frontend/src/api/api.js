import axios from 'axios';

// Substitua pelo IP da sua máquina na mesma rede que o celular
export const API_URL = 'https://a64748226e25.ngrok-free.app/api'; // exemplo

const api = axios.create({
  baseURL: API_URL,
});

export default api;
