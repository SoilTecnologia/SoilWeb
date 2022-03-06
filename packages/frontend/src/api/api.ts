import axios from "axios";
import { parseCookies } from "nookies";

const { "soilauth-token": token } = parseCookies();

export const api = axios.create({
  baseURL: `http://192.168.0.5:3308/`,
});

if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
