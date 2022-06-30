import axios from "axios";

const devLocal = "http://localhost:3308/";
const prod = "https://api.soiltech.com.br/";
const devWeb = "https://be.soiltech.com.br/";
const gateway = "192.168.100.104";

export const api = axios.create({
  baseURL: gateway,
});

// api.interceptors.request.use((config) => {
//   console.log(token);

//   return config;
// });

// if (token) {
//   api.defaults.headers.common["Authorization"] = `${token}`;
// }
