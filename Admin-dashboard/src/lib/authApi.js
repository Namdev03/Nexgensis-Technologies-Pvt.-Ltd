import api from "./axios";

export async function login({ username, password }) {
  const response = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });

  return response.data;
}