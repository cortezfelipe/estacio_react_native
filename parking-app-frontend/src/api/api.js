import axios from "axios";

// Substitua pelo IP da sua máquina na mesma rede que o celular
export const API_URL = "https://b9744786746b.ngrok-free.app/api"; // exemplo

const api = axios.create({
  baseURL: API_URL,
});

export default api;
