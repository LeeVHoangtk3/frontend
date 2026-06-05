import axios from 'axios';

export const baseServerURL = "http://localhost:8080";

const apiURL = `${baseServerURL}/api`;

const axiosClient = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export default axiosClient;