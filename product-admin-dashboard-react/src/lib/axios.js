import axios from "axios";

// One shared Axios instance for the whole app.
// - The request interceptor attaches the logged-in user's token to every call.
// - The response interceptor turns every failure into one predictable shape
//   ({ message, status }) so components never have to parse Axios errors themselves.
const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("pad_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let a cancelled request (AbortController) pass through distinctly
    // instead of being turned into a fake "server error".
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    let message = "Something went wrong. Please try again.";
    const status = error?.response?.status;

    if (status === 401) {
      message = "Your session has expired. Please log in again.";
      window.localStorage.removeItem("pad_token");
      window.localStorage.removeItem("pad_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (status === 404) {
      message = "We couldn't find what you were looking for.";
    } else if (status >= 500) {
      message = "The server had a problem. Please try again shortly.";
    } else if (error.code === "ECONNABORTED") {
      message = "The request timed out. Check your connection and retry.";
    } else if (!error.response) {
      message = "Network error. Check your connection and retry.";
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    return Promise.reject({ message, status, raw: error });
  }
);

export default api;
