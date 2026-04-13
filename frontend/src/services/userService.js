import axiosInstance from "./axiosInstance";

export async function getAllUsers() {
  const res = await axiosInstance.get("/api/user/all");
  return res.data;
}

export async function deleteUser(id) {
  const res = await axiosInstance.delete(`/api/user/delete/${id}`);
  return res.data;
}

export async function updateUser(id, userData) {
  const res = await axiosInstance.put(`/api/user/update/${id}`, userData);
  return res.data;
}