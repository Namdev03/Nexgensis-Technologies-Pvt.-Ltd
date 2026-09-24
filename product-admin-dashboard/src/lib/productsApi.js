import api from "./axios";

// All product-related network calls live here so components never call
// axios directly. Every read function accepts an optional AbortController
// signal so callers can cancel a stale request (needed for fast typing in search).

export function fetchProducts({ limit, skip, sortBy, order, signal }) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  return api.get("/products", { params, signal }).then((res) => res.data);
}

export function fetchProductsByCategory({ category, limit, skip, sortBy, order, signal }) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  return api
    .get(`/products/category/${encodeURIComponent(category)}`, { params, signal })
    .then((res) => res.data);
}

export function searchProducts({ q, limit, skip, signal }) {
  return api
    .get("/products/search", { params: { q, limit, skip }, signal })
    .then((res) => res.data);
}

export function fetchCategories(signal) {
  return api.get("/products/categories", { signal }).then((res) => res.data);
}

export function fetchProductById(id, signal) {
  return api.get(`/products/${id}`, { signal }).then((res) => res.data);
}

export function createProduct(payload) {
  return api.post("/products/add", payload).then((res) => res.data);
}

export function updateProduct(id, payload) {
  return api.put(`/products/${id}`, payload).then((res) => res.data);
}

export function deleteProduct(id) {
  return api.delete(`/products/${id}`).then((res) => res.data);
}
