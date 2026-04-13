import axiosInstance from "./axiosInstance";

export async function getAllProducts() {
  const res = await axiosInstance.get("/api/product/all");
  return res.data;
}

export async function getMyProducts() {
  const res = await axiosInstance.get("/api/product/my-products");
  return res.data;
}

export async function getAllProductsPaginated(page = 0, size = 5) {
  const res = await axiosInstance.get(`/api/product/all-paginated?page=${page}&size=${size}`);
  return res.data;
}

export async function createProduct(productData) {
  const res = await axiosInstance.post("/api/product/register", productData);
  return res.data;
}

export async function updateProduct(id, productData) {
  const res = await axiosInstance.put(`/api/product/update/${id}`, productData);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await axiosInstance.delete(`/api/product/delete/${id}`);
  return res.data;
}