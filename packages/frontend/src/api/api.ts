import axios from "axios";

export const api = axios.create({
  baseURL: `https://teste.soiltech.com.br:3308/`,
});

// api.interceptors.request.use((config) => {
//   console.log(token);

//   return config;
// });

// if (token) {
//   api.defaults.headers.common["Authorization"] = `${token}`;
// }
