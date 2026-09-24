import api from "./axios";

// All product-related network calls live here.
// Components should not call Axios directly.
// Read functions accept an optional AbortController signal
// so requests can be cancelled when needed.

export async function fetchProducts({
  limit,
  skip,
  sortBy,
  order,
  signal,
}) {
  const params = {
    limit,
    skip,
  };

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }

  const response = await api.get("/products", {
    params,
    signal,
  });
  return response.data;
}

export async function fetchProductsByCategory({ category, limit, skip, sortBy, order, signal }) {
  const params = {
    limit,
    skip,
  };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }

  const response = await api.get(
    `/products/category/${encodeURIComponent(category)}`,
    {
      params,
      signal,
    }
  );

  return response.data;
}

export async function searchProducts({
  q,
  limit,
  skip,
  signal,
}) {
  const response = await api.get("/products/search", {
    params: {
      q,
      limit,
      skip,
    },
    signal,
  });

  return response.data;
}

export async function fetchCategories(signal) {
  const response = await api.get("/products/categories", {
    signal,
  });

  return response.data;
}

export async function fetchProductById(id, signal) {
  const response = await api.get(`/products/${id}`, {
    signal,
  });

  return response.data;
}

export async function createProduct(payload) {
  const response = await api.post("/products/add", payload);

  return response.data;
}

export async function updateProduct(id, payload) {
  const response = await api.put(`/products/${id}`, payload);

  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);

  return response.data;
}
