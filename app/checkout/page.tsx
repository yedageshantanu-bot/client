"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getAddresses, saveAddress } from "@/lib/authApi";
import { payWithRazorpay } from "@/lib/payment";
import type { Address, Order } from "@/lib/types";
import { getSafeImageUrl } from "@/lib/localAssets";
import { formatPrice } from "@/lib/utils";
import { brandName, brandTagline } from "@/lib/brand";

const emptyAddress: Address = {
  fullName: "",
  phone: "",
  pincode: "",
  state: "",
  city: "",
  address: "",
  landmark: "",
};

const steps = ["Address", "Summary", "Payment"];
const requiredAddressFields: Array<keyof Address> = [
  "fullName",
  "phone",
  "address",
  "city",
  "state",
  "pincode",
];

function CheckoutContent() {
  const { user } = useAuth();
  const { items, subtotal, discount, total, coupon, clearCart } = useCart();
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [saveForLater, setSaveForLater] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  const shipping = total >= 999 || total === 0 || total === 1 ? 0 : 99;
  const finalTotal = total + shipping;
  const isAddressComplete = requiredAddressFields.every((field) =>
    String(address[field] || (field === "fullName" ? user?.name || "" : "")).trim(),
  );

  useEffect(() => {
    let active = true;

    const loadDefaultAddress = async () => {
      try {
        const response = await getAddresses();
        const defaultAddress =
          response.addresses.find((item) => item.isDefault) || response.addresses[0];

        if (active && defaultAddress) {
          setAddress({ ...emptyAddress, ...defaultAddress });
        }
      } catch {
        // A fresh checkout form is fine when no saved address exists yet.
      }
    };

    void loadDefaultAddress();

    return () => {
      active = false;
    };
  }, []);

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        size: item.size || "Free Size",
        color: item.color || "As shown",
      })),
    [items],
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    const shippingAddress: Address = {
      ...address,
      fullName: address.fullName || user.name,
    };

    const missingField = requiredAddressFields.find((field) => !String(shippingAddress[field] || "").trim());
    if (missingField) {
      toast.error("Please complete all required delivery details");
      return;
    }

    setLoading(true);

    try {
      const order = await payWithRazorpay({
        items: orderItems,
        address: shippingAddress,
        subtotal,
        couponCode: coupon?.code,
        couponDiscount: discount,
        total: finalTotal,
      });

      if (saveForLater) {
        await saveAddress({
          ...shippingAddress,
          label: "Default delivery",
          isDefault: true,
        }).catch(() => undefined);
      }

      clearCart();
      setSuccessOrder(order);
      toast.success("Payment successful. Order placed.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      toast.error(
        message.includes("ObjectId") || message.includes("Cast to")
          ? "Some cart items are outdated. Please remove them and add again."
          : message || "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="container-page pt-28 pb-16">
        <div className="mx-auto max-w-3xl rounded-[8px] border border-brand-border bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto text-emerald-600" size={62} />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">
            Order confirmed
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-brand-muted">
            {brandName} - {brandTagline}
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold text-ink">
            Thank you, {user?.name}
          </h1>
          <p className="mt-3 text-brand-muted">
            Order {successOrder.orderId} is paid and ready for tracking.
          </p>
          <div className="mx-auto mt-7 grid max-w-xl gap-3 rounded-[8px] bg-beige-soft p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-brand-muted">Order ID</span>
              <span className="font-semibold text-ink">{successOrder.orderId}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-brand-muted">Payment ID</span>
              <span className="break-all text-right font-semibold text-ink">
                {successOrder.razorpayPaymentId}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-brand-muted">Customer</span>
              <span className="font-semibold text-ink">{successOrder.customer}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-brand-muted">Date</span>
              <span className="font-semibold text-ink">
                {new Date(successOrder.createdAt || successOrder.date).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Delivery status</span>
              <span className="font-semibold text-ink">{successOrder.deliveryStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Payment status</span>
              <span className="font-semibold text-ink">{successOrder.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Amount</span>
              <span className="font-semibold text-ink">{formatPrice(successOrder.total)}</span>
            </div>
            <div className="border-t border-brand-border pt-3">
              <p className="font-semibold text-ink">Order summary</p>
              <div className="mt-2 grid gap-2">
                {successOrder.products.map((product) => (
                  <div
                    key={`${successOrder._id}-${product.productId}`}
                    className="flex justify-between gap-4 text-brand-muted"
                  >
                    <span>{product.title} x {product.quantity}</span>
                    <span className="font-semibold text-ink">
                      {formatPrice(product.price * product.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/account">View my orders</Button>
            <Button href="/collection" variant="outline">
              Continue shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page pt-28 pb-20 text-center">
        <PackageCheck className="mx-auto text-gold-dark" size={54} />
        <h1 className="mt-5 font-display text-5xl font-semibold text-ink">
          Your cart is empty
        </h1>
        <p className="mt-3 text-brand-muted">Add a saree before starting checkout.</p>
        <Button className="mt-6" href="/shop">
          Back to shop
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fffaf3_0%,#f8f3eb_46%,#f5ede3_100%)] pt-24">
    <div className="container-page py-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">
            Secure checkout
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl md:text-6xl">
            Complete your order
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.22em] text-brand-muted">
            {brandName} - {brandTagline}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <span
              key={step}
              className="rounded-full border border-brand-border bg-white px-3 py-2 text-[0.68rem] font-semibold text-ink sm:px-4 sm:text-xs"
            >
              {index + 1}. {step}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_410px]">
        <div className="grid gap-6">
          <section className="rounded-[8px] border border-brand-border bg-white/82 p-5 shadow-[0_1rem_2.8rem_rgba(59,42,40,0.06)]">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-beige-soft text-gold-dark">
                <MapPin size={19} />
              </span>
              <div>
                <h2 className="font-display text-3xl font-semibold text-ink">
                  Delivery address
                </h2>
                <p className="text-sm text-brand-muted">
                  This address will be used for delivery tracking.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["fullName", "Full name"],
                ["phone", "Mobile number"],
                ["pincode", "Pincode"],
                ["state", "State"],
                ["city", "City"],
                ["address", "House / Area / Road"],
                ["landmark", "Landmark"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className={key === "address" || key === "landmark" ? "sm:col-span-2" : ""}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
                    {label}
                  </span>
                  <input
                    required={key !== "landmark"}
                    value={
                      key === "fullName"
                        ? address.fullName || user?.name || ""
                        : String(address[key as keyof Address] || "")
                    }
                    onChange={(event) =>
                      setAddress({ ...address, [key]: event.target.value })
                    }
                    className="mt-2 h-11 w-full rounded-[8px] border border-brand-border px-3 text-sm outline-none focus:border-gold"
                    inputMode={key === "phone" || key === "pincode" ? "numeric" : "text"}
                  />
                </label>
              ))}
            </div>

            <label className="mt-5 flex items-center gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={saveForLater}
                onChange={(event) => setSaveForLater(event.target.checked)}
                className="h-4 w-4 accent-ink"
              />
              Save this address for future orders
            </label>
          </section>

          <section className="rounded-[8px] border border-brand-border bg-white/82 p-5 shadow-[0_1rem_2.8rem_rgba(59,42,40,0.06)]">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-beige-soft text-gold-dark">
                <CreditCard size={19} />
              </span>
              <div>
                <h2 className="font-display text-3xl font-semibold text-ink">
                  Payment
                </h2>
                <p className="text-sm text-brand-muted">
                  Pay securely online with Razorpay.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-[8px] border border-ink bg-ink p-4 text-white">
              <CreditCard size={20} className="text-gold" />
              <span>
                <span className="block text-sm font-semibold">Razorpay Online Payment</span>
                <span className="mt-1 block text-xs text-white/70">
                  Cards, UPI, wallets, and net banking
                </span>
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-[8px] bg-beige-soft p-4 text-sm text-brand-muted">
              <ShieldCheck size={18} className="text-gold-dark" />
              Order is created only after Razorpay confirms payment.
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[8px] border border-brand-border bg-[var(--color-ivory-3)] p-4 shadow-[0_1rem_2.8rem_rgba(59,42,40,0.08)] sm:p-5 lg:sticky lg:top-28">
          <h2 className="font-display text-3xl font-semibold text-ink">
            Order summary
          </h2>

          <div className="mt-5 grid gap-4">
            {orderItems.map((item) => (
              <div
                key={`${item._id}-${item.size}-${item.color}`}
                className="grid grid-cols-[76px_1fr] gap-3 rounded-[8px] bg-white p-3"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-beige-soft">
                  <Image
                    src={getSafeImageUrl(item.image)}
                    alt={item.title}
                    fill
                    sizes="76px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-brand-muted">
                    Qty {item.quantity} / {item.size} / {item.color}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {formatPrice(item.discountPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 border-t border-brand-border pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Coupon discount</span>
              <span className="text-emerald-700">-{formatPrice(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-brand-border pt-4 text-base font-semibold text-ink">
              <span>Final total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <Button className="mt-6 w-full" disabled={loading || !user || !isAddressComplete}>
            {loading && <Loader2 className="animate-spin" size={17} />}
            Pay with Razorpay
          </Button>

          <Link
            href="/cart"
            className="mt-4 block text-center text-sm font-semibold text-brand-muted hover:text-ink"
          >
            Back to cart
          </Link>
        </aside>
      </form>
    </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute nextPath="/checkout">
      <CheckoutContent />
    </ProtectedRoute>
  );
}
