import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: BACKEND_URL + "/api",
  withCredentials: true,
});

export default axiosClient;
