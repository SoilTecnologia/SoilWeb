import axios from "axios";

const dev = "http://localhost:3308/";
const prod = "https://api.soiltech.com.br/";

export const api = axios.create({
  baseURL: dev,
});

// api.interceptors.request.use((config) => {
//   console.log(token);

//   return config;
// });

// if (token) {
//   api.defaults.headers.common["Authorization"] = `${token}`;
// }
