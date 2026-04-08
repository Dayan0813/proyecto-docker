const API_BASE = (import.meta.env.VITE_API_BASE as string) || "/api";
const TOKEN_KEY = "api_token";

type LoginResp = { token: string; user: any };

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    throw new ApiError(res.status, "Formato de respuesta inválido");
  }

  if (res.status === 401 && path === "/auth/me") {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      (data && data.message) || res.statusText || "Error",
    );
  }

  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResp> {
  const resp = await request(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (resp.token) localStorage.setItem(TOKEN_KEY, resp.token);
  return resp;
}

export async function register(payload: any): Promise<LoginResp> {
  const resp = await request(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (resp.token) localStorage.setItem(TOKEN_KEY, resp.token);
  return resp;
}

export async function getMe() {
  return await request(`/auth/me`);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("user");
}

export async function getProducts() {
  return await request(`/products`);
}
export async function getProduct(id: string) {
  return await request(`/products/${id}`);
}

export async function createProduct(payload: any) {
  return await request(`/products/json`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id: string, payload: any) {
  return await request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: string) {
  return await request(`/products/${id}`, { method: "DELETE" });
}

export async function getCart() {
  return await request(`/cart`);
}

export async function addToCart(productId: number, quantity: number) {
  return await request(`/cart/add`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function removeFromCart(itemId: string | number) {
  return await request(`/cart/item/${itemId}`, { method: "DELETE" });
}

export async function checkout() {
  return await request(`/cart/checkout`, { method: "POST" });
}

export async function post(path: string, payload: any) {
  return await request(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProfile(payload: any) {
  return await request(`/auth/updateProfile`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getAdminStats() {
  return await request(`/auth/stats`);
}
export async function getAdminOrders() {
  return await request("/auth/orders");
}
export async function adminGetUsers() {
  return await request(`/auth/users`);
}
export async function deleteUser(id: string | number) {
  return await request(`/auth/users/${id}`, { method: "DELETE" });
}

export default {
  login,
  register,
  getMe,
  setToken,
  getToken,
  logout,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  post,
  updateProfile,
  getAdminStats,
  getAdminOrders,
  adminGetUsers,
  deleteUser,
};
