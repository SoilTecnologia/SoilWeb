import axios from 'axios';
import { parseCookies } from 'nookies';

const { "soilauth-token": token } = parseCookies();

export const api = axios.create({
  baseURL: `http://localhost:3308/`,
});

api.interceptors.request.use((config) => {
  console.log(token);

  return config;
});

if (token) {
  api.defaults.headers.common["Authorization"] = `${token}`;
}
