import axios from "axios";

export const baseServerURL = "https://cysxr4-8080.csb.app";

const apiURL = `${baseServerURL}/api`;

const axiosClient = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export default axiosClient;
