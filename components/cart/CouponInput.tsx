"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Tag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { validateCouponCode } from "@/lib/couponApi";
import { Button } from "@/components/ui/Button";

export function CouponInput() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { items, coupon, applyCoupon, removeCoupon } = useCart();

  const submit = async () => {
    setLoading(true);

    try {
      const result = await validateCouponCode({ code, items });

      if (!result.valid || !result.coupon || result.amount === undefined) {
        toast.error(result.message);
        return;
      }

      applyCoupon({
        _id: result.coupon._id,
        code: result.coupon.code,
        type: result.coupon.type,
        discount: result.coupon.discount,
        amount: result.amount,
      });
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Coupon could not be applied");
    } finally {
      setLoading(false);
    }
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-[8px] border border-gold bg-gold/10 p-3 text-sm">
        <span className="flex items-center gap-2 font-semibold text-ink">
          <Tag size={16} />
          {coupon.code} applied
        </span>
        <button
          className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink"
          onClick={removeCoupon}
          aria-label="Remove coupon"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <input
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="Coupon code"
        className="h-11 rounded-full border border-brand-border px-4 text-sm uppercase outline-none focus:border-gold"
      />
      <Button variant="outline" onClick={() => void submit()} disabled={!code.trim() || loading}>
        {loading ? "Checking" : "Apply"}
      </Button>
    </div>
  );
}
