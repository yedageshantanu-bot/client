const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://vastraaura-backend.onrender.com/api";

export const api = {
  base: API_URL,
  products: `${API_URL}/products`,
  orders: `${API_URL}/orders`,
  coupons: `${API_URL}/coupons`,
  users: `${API_URL}/users`,
  admin: `${API_URL}/admin`,
  health: `${API_URL}/health`,
};
