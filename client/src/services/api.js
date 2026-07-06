 import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const MAX_RETRY_COUNT = 2;
const RETRY_DELAY_MS = 1000;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("gavyadhenu_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('API request setup failed:', error.message || error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    const retryCount = config._retryCount || 0;
    const shouldRetry =
      retryCount < MAX_RETRY_COUNT &&
      (!error.response || error.response.status === 503);

    if (shouldRetry) {
      config._retryCount = retryCount + 1;
      console.warn(`Retrying request ${config.url} (${config._retryCount}/${MAX_RETRY_COUNT}) after error:`, error.message);
      await delay(RETRY_DELAY_MS);
      return API(config);
    }

    console.error('API response error:', error.message, error.response?.status, error.config?.url);

    // Network error (no response) — notify the UI so it can show a persistent banner
    if (!error.response) {
      try {
        window.dispatchEvent(new CustomEvent('api-network-error', { detail: { message: error.message || 'Network error' } }));
      } catch (e) {
        // ignore in non-browser environments
      }
    } else if (error.response && error.response.status >= 500) {
      // server-side error
      try {
        window.dispatchEvent(new CustomEvent('api-network-error', { detail: { message: error.response.data?.message || 'Server error' } }));
      } catch (e) {}
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("gavyadhenu_token");
    }

    return Promise.reject(error);
  }
);

// On successful responses dispatch an "ok" event so UI can clear network banner
API.interceptors.response.use((response) => {
  try {
    if (window && (response?.status >= 200 && response?.status < 400)) {
      window.dispatchEvent(new CustomEvent('api-network-ok'));
    }
  } catch (e) {}
  return response;
}, (e) => Promise.reject(e));

export default API;