import type { CartItem, Coupon } from "./types";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => {
  const safe = Number.isFinite(value) ? value : 0;
  // Use a literal "₹" + non-breaking space + digits so the symbol can never
  // collide with the digit baseline or be clipped by tight line-height.
  return `₹ ${rupeeFormatter.format(Math.round(safe))}`;
};

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0);

export const calculateCouponDiscount = (subtotal: number, coupon: Coupon) => {
  const discount =
    coupon.type === "percentage"
      ? Math.round((subtotal * coupon.discount) / 100)
      : coupon.discount;
  const cappedDiscount =
    coupon.maxDiscount && coupon.maxDiscount > 0
      ? Math.min(discount, coupon.maxDiscount)
      : discount;

  return Math.min(cappedDiscount, subtotal);
};

export const validateCoupon = ({
  code,
  coupons,
  items,
  userEmail,
}: {
  code: string;
  coupons: Coupon[];
  items: CartItem[];
  userEmail?: string;
}) => {
  const normalizedCode = code.trim().toUpperCase();
  const coupon = coupons.find((item) => item.code === normalizedCode);
  const subtotal = cartSubtotal(items);

  if (!coupon) {
    return { valid: false, message: "This coupon code is not valid." };
  }

  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is paused or deleted." };
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, message: "This coupon has expired." };
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, message: "This coupon usage limit is over." };
  }

  if (subtotal < coupon.minimumOrder) {
    return {
      valid: false,
      message: `Minimum order value is ${formatPrice(coupon.minimumOrder)}.`,
    };
  }

  if (coupon.applicableProducts.length > 0) {
    const hasApplicableProduct = items.some((item) =>
      coupon.applicableProducts.includes(item._id),
    );

    if (!hasApplicableProduct) {
      return {
        valid: false,
        message: "This coupon is valid only on selected products.",
      };
    }
  }

  if (
    coupon.oneUsePerUser &&
    userEmail &&
    coupon.usedBy.includes(userEmail.toLowerCase())
  ) {
    return { valid: false, message: "You have already used this coupon." };
  }

  const amount = calculateCouponDiscount(subtotal, coupon);

  return {
    valid: true,
    message: `Coupon applied. You saved ${formatPrice(amount)}.`,
    coupon,
    amount,
  };
};

export const getInitials = (name: string) => {
  if (!name) return "??";
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) {
    // Single word: take first 2 letters
    return parts[0].slice(0, 2).toUpperCase();
  }
  // Multi-word: first letter of first two words
  return (parts[0][0] + (parts[1][0] ?? "")).toUpperCase();
};

export const makeOrderId = (count: number) =>
  `VA${String(10001 + count).padStart(5, "0")}`;
