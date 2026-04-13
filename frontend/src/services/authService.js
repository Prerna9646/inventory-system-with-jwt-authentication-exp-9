import axios from "axios";

const BASE_URL = "http://localhost:8080";

// Decode JWT payload (no library needed)
export function decodeToken(token) {
  try {
    const cleanToken = token.replace("Bearer ", "");
    const payload = cleanToken.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    return null;
  }
}

export async function loginUser(email, password) {
  const res = await axios.post(`${BASE_URL}/api/user/login`, { email, password });
  return res.data;
}

export async function registerUser(userData) {
  const res = await axios.post(`${BASE_URL}/api/user/register`, userData);
  return res.data;
}