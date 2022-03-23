import axios from "axios";

export const api = axios.create({
  baseURL: `https://api.soiltech.com.br/`,
});

// api.interceptors.request.use((config) => {
//   console.log(token);

//   return config;
// });

// if (token) {
//   api.defaults.headers.common["Authorization"] = `${token}`;
// }
