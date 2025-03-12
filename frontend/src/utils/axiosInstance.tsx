import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7000/api/v1",
  withCredentials: true, // It help uo to send the cookie to server for each n every request
});

export default axiosInstance;
