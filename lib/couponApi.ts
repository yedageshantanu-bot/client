import { api } from "./api";
import type { CartItem, Coupon } from "./types";

type CouponValidationResponse = {
  valid: boolean;
  message: string;
  coupon?: Coupon;
  discount?: number;
  amount?: number;
  subtotal?: number;
  total?: number;
};

const parseCouponResponse = async <T,>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Coupon request failed");
  }

  return payload as T;
};

export const loadCoupons = async () => {
  const response = await fetch(api.coupons, {
    cache: "no-store",
    credentials: "include",
  });

  return parseCouponResponse<Coupon[]>(response);
};

export const createCoupon = async (
  coupon: Omit<Coupon, "_id" | "usedCount" | "usedBy">,
) => {
  const response = await fetch(api.coupons, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(coupon),
  });

  return parseCouponResponse<Coupon>(response);
};

export const updateCoupon = async (id: string, coupon: Partial<Coupon>) => {
  const response = await fetch(`${api.coupons}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(coupon),
  });

  return parseCouponResponse<Coupon>(response);
};

export const deleteCoupon = async (id: string) => {
  const response = await fetch(`${api.coupons}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  await parseCouponResponse<{ success: boolean }>(response);
};

export const validateCouponCode = async ({
  code,
  items,
}: {
  code: string;
  items: CartItem[];
}) => {
  const response = await fetch(`${api.coupons}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ code, items }),
  });

  return parseCouponResponse<CouponValidationResponse>(response);
};
