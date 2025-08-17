import axios from "axios";

const api = axios.create({
  baseURL: "https://dev-pair-backendd.vercel.app/api",
});

export default api;