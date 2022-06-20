import axios from "axios";

const devLocal = "http://localhost:3308/";
const devDocker = "http://localhost:3333/";
const prod = "https://api.soiltech.com.br/";
const devWeb = "https://be.soiltech.com.br/";

export const api = axios.create({
  baseURL: devDocker,
});
