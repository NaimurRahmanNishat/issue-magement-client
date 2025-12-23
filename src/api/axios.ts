/* eslint-disable @typescript-eslint/no-explicit-any */

// axios.ts - Updated version
import axios from "axios";
import { getBaseUrl } from "@/utils/getBaseUrl";

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // Avoid infinite loop on refresh endpoint
    if (originalRequest.url?.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/api/v1/auth/refresh-token");
        processQueue(null, null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Optional: dispatch logout action here
        // store.dispatch({ type: "auth/logout" });
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
