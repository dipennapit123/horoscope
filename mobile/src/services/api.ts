import axios from "axios";
import { useSessionStore } from "../store/useSessionStore";
import { publicEnv } from "../config/publicEnv";
import { firebaseAuth } from "./firebase";

// Point to admin-dashboard2 API (Next.js). For device/simulator use your machine IP, e.g. http://192.168.1.x:3000/api
const baseURL = publicEnv.apiBaseUrl();
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

// Retry on timeout / network / 5xx errors; refresh Firebase token once on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as typeof error.config & {
      _retryCount?: number;
      _didRefresh401?: boolean;
    };
    if (!config) return Promise.reject(error);

    if (
      error.response?.status === 401 &&
      !config._didRefresh401 &&
      firebaseAuth.currentUser
    ) {
      config._didRefresh401 = true;
      try {
        const user = firebaseAuth.currentUser;
        const token = await user.getIdToken(true);
        useSessionStore.getState().setAuth({ clerkUserId: user.uid, token });
        const h = config.headers ?? {};
        Object.assign(h as object, { Authorization: `Bearer ${token}` });
        config.headers = h;
        return api.request(config);
      } catch {
        // fall through to reject
      }
    }

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
