import axios from "axios";
import { useSessionStore } from "../store/useSessionStore";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";
const REQUEST_TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

export const api = axios.create({
  baseURL,
  timeout: REQUEST_TIMEOUT_MS,
});

// Attach Clerk session token and user id for backend auth
api.interceptors.request.use((config) => {
  const { token, clerkUserId } = useSessionStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (clerkUserId) {
    config.headers["x-clerk-user-id"] = clerkUserId;
  }
  return config;
});

// Retry on timeout / network / 5xx errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as typeof error.config & { _retryCount?: number };
    if (!config) return Promise.reject(error);

    const count = config._retryCount ?? 0;
    const shouldRetry =
      count < MAX_RETRIES &&
      (error.code === "ECONNABORTED" ||
        error.message === "Network Error" ||
        (error.response?.status >= 500 && error.response?.status < 600));

    if (shouldRetry) {
      config._retryCount = count + 1;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (count + 1)));
      return api.request(config);
    }

    return Promise.reject(error);
  }
);
