import { api } from "./api";
import { sanitizeInternalPath } from "./authRules";
import type { Address, Order, Product, User } from "./types";

type RequestOptions = RequestInit & {
  body?: BodyInit | null;
};

const requestJson = async <T>(url: string, options: RequestOptions = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || "Request failed");
  }

  return payload as T;
};

export const googleAuthUrl = (nextPath = "/") =>
  `${api.users}/google?popup=1&next=${encodeURIComponent(
    sanitizeInternalPath(nextPath, "/"),
  )}`;

export const getCurrentUser = () =>
  requestJson<{ success: true; user: User }>(`${api.base}/auth/me`, {
    method: "GET",
  });

export const registerUser = (payload: { name: string; email: string; password: string }) =>
  requestJson<{ success: true; message: string; user: User }>(`${api.users}/register`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload: { email: string; password: string }) =>
  requestJson<{ success: true; message: string; user: User }>(`${api.users}/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const forgotPassword = (email: string) =>
  requestJson<{ success: true; message: string; resetToken?: string }>(
    `${api.users}/forgot-password`,
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );

export const resetPassword = (payload: { token: string; password: string }) =>
  requestJson<{ success: true; message: string; user: User }>(
    `${api.users}/reset-password`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

export const getProfile = () =>
  requestJson<{ success: true; user: User; orders: Order[]; addresses: Address[] }>(
    `${api.users}/profile`,
    { method: "GET" },
  );

export const getUsers = () =>
  requestJson<{ success: true; users: User[] }>(api.users, {
    method: "GET",
  });

export const updateProfile = (payload: Partial<User>) =>
  requestJson<{ success: true; user: User }>(`${api.users}/me`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const logoutUser = () =>
  requestJson<{ success: true; message: string }>(`${api.users}/logout`, {
    method: "POST",
  });

export const getWishlist = () =>
  requestJson<{ success: true; wishlist: Product[] }>(`${api.users}/wishlist`, {
    method: "GET",
  });

export const toggleWishlist = (productId: string) =>
  requestJson<{ success: true; wishlist: Product[]; user: User }>(`${api.users}/wishlist`, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });

export const getAddresses = () =>
  requestJson<{ success: true; addresses: Address[] }>(`${api.users}/addresses`, {
    method: "GET",
  });

export const saveAddress = (address: Partial<Address> & { label?: string; isDefault?: boolean }) =>
  requestJson<{ success: true; addresses: Address[] }>(`${api.users}/addresses`, {
    method: "POST",
    body: JSON.stringify(address),
  });

export const updateAddress = (
  addressId: string,
  address: Partial<Address> & { label?: string; isDefault?: boolean },
) =>
  requestJson<{ success: true; addresses: Address[] }>(
    `${api.users}/addresses/${addressId}`,
    {
      method: "PUT",
      body: JSON.stringify(address),
    },
  );

export const deleteAddress = (addressId: string) =>
  requestJson<{ success: true; addresses: Address[] }>(
    `${api.users}/addresses/${addressId}`,
    { method: "DELETE" },
  );

export const getMyOrders = () =>
  requestJson<{ success: true; orders: Order[] }>(`${api.orders}/me`, {
    method: "GET",
  });

export const getAllOrders = () =>
  requestJson<{ success: true; orders: Order[] }>(api.orders, {
    method: "GET",
  });

export const updateOrderDeliveryStatus = (
  orderId: string,
  deliveryStatus: Order["deliveryStatus"],
) =>
  requestJson<{ success: true; order: Order }>(`${api.orders}/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ deliveryStatus }),
  });

export type CheckoutPayload = {
  items: Array<{
    _id: string;
    title: string;
    discountPrice: number;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
    color?: string;
  }>;
  address: Address;
  subtotal: number;
  couponCode?: string;
  couponDiscount: number;
  total: number;
};

export const createRazorpayOrder = (payload: CheckoutPayload) =>
  requestJson<{
    success: true;
    keyId: string;
    amount: number;
    razorpayOrder: {
      id: string;
      amount: number;
      currency: "INR";
    };
    customer: {
      name: string;
      email: string;
      contact: string;
    };
  }>(`${api.orders}/razorpay/create`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const verifyRazorpayPayment = (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData: CheckoutPayload;
}) =>
  requestJson<{ success: true; order: Order }>(`${api.orders}/razorpay/verify`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
