"use client";

import axios from "axios";
import {BACKEND_URL} from "@/config";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  formSerializer: {
    indexes: null,
    dots: true
  }
})
axiosInstance.interceptors.request.use((config) => {
  const authPaths = ["/auth/login", "/auth/signup"];

  if (authPaths.includes(config.url!)) {
    return config;
  }
  const token = localStorage.getItem('access_token')
  if (!token) {
    window.location.href = "/auth/sign-in"
    return config;
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config
})

axiosInstance.interceptors.response.use((res) => {
  return res
},(error) => {
  if (error.response.status === 401) {
    localStorage.removeItem('access_token');
    return Promise.resolve()
  }
  return Promise.reject(error);
})

export default axiosInstance;
