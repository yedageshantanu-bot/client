import React, { useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";
import { Lock, Check, Gift } from "lucide-react";
import { toast } from "sonner";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cart, totals, note, clearCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    country: "India",
    zip: "",
    gift_wrap: true,
  });

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to cart if cart is empty
  if (cart.length === 0 && !submitting) {
    return <Navigate to="/cart" replace />;
  }

  const update = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load Razorpay. Please check your internet connection.");
        setSubmitting(false);
        return;
      }

      // Format payload for the backend API validator
      const payload = {
        items: cart.map((i) => ({
          productId: i.id,
          title: i.name,
          price: i.price,
          quantity: i.qty,
          image: i.image,
        })),
        address: {
          fullName: form.customer_name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.zip,
        },
        couponCode: "", // Add coupon code if implemented
      };

      // 1. Create Razorpay order
      const createRes = await api.post("/orders/razorpay/create", payload).then((r) => r.data);

      if (!createRes.success) {
        throw new Error(createRes.error || "Order creation failed");
      }

      // 2. Open Razorpay payment gateway
      const options = {
        key: createRes.keyId,
        amount: createRes.razorpayOrder.amount,
        currency: createRes.razorpayOrder.currency,
        name: "Alaira House",
        description: "Luxury Love Gifts",
        order_id: createRes.razorpayOrder.id,
        handler: async (response) => {
          try {
            // 3. Verify Razorpay payment
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await api
              .post("/orders/razorpay/verify", verifyPayload)
              .then((r) => r.data);

            if (verifyRes.success) {
              clearCart();
              toast.success("Order placed with love");
              navigate(`/order/${verifyRes.order._id || verifyRes.order.orderId}`);
            } else {
              toast.error(verifyRes.error || "Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification failed", err);
            toast.error(err.response?.data?.error || "Error verifying payment signature.");
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: createRes.customer.name,
          email: form.email,
          contact: createRes.customer.contact,
        },
        theme: {
          color: "#E5497C",
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
      toast.error(err.response?.data?.error || err.message || "Failed to initiate payment.");
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-[16px] bg-white/90 border border-[#EEE7FA] px-4 py-3 text-[14.5px] outline-none focus:ring-2 focus:ring-[#F7C7DC]";

  return (
    <main data-testid="checkout-page" className="pt-28 min-h-screen pastel-mesh">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <p className="overline">Checkout</p>
        <h1 className="mt-2 font-display font-semibold text-[#1C1924] text-4xl md:text-5xl tracking-tight">
          Almost there — one heart, one address away.
        </h1>

        <form onSubmit={submit} className="mt-10 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 glass-card rounded-[22px] p-6 md:p-8 space-y-5">
            <div>
              <p className="font-display font-semibold text-[#1C1924] mb-3">Contact</p>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  required
                  data-testid="checkout-name"
                  placeholder="Full name"
                  className={field}
                  value={form.customer_name}
                  onChange={update("customer_name")}
                />
                <input
                  required
                  data-testid="checkout-email"
                  type="email"
                  placeholder="Email"
                  className={field}
                  value={form.email}
                  onChange={update("email")}
                />
                <input
                  required
                  data-testid="checkout-phone"
                  placeholder="Phone"
                  className={field}
                  value={form.phone}
                  onChange={update("phone")}
                />
              </div>
            </div>
            <div>
              <p className="font-display font-semibold text-[#1C1924] mb-3">Ship to your love</p>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  required
                  data-testid="checkout-address"
                  placeholder="Street address"
                  className={`${field} md:col-span-2`}
                  value={form.address}
                  onChange={update("address")}
                />
                <input
                  required
                  data-testid="checkout-city"
                  placeholder="City"
                  className={field}
                  value={form.city}
                  onChange={update("city")}
                />
                <input
                  required
                  data-testid="checkout-state"
                  placeholder="State"
                  className={field}
                  value={form.state}
                  onChange={update("state")}
                />
                <input
                  required
                  data-testid="checkout-zip"
                  placeholder="ZIP / Postal code (Pincode)"
                  className={field}
                  value={form.zip}
                  onChange={update("zip")}
                />
                <input
                  required
                  data-testid="checkout-country"
                  placeholder="Country"
                  className={`${field} md:col-span-2`}
                  value={form.country}
                  onChange={update("country")}
                />
              </div>
            </div>
            <label className="flex items-center gap-3 text-[14px] text-[#1C1924] mt-2">
              <input
                data-testid="checkout-giftwrap"
                type="checkbox"
                checked={form.gift_wrap}
                onChange={update("gift_wrap")}
                className="w-4 h-4 accent-[#E5497C]"
              />
              Include free hand-tied gift wrap
            </label>

            <div className="pt-4 border-t border-[#EEE7FA]">
              <p className="font-display font-semibold text-[#1C1924] mb-3">Payment method</p>
              <div className="rounded-[16px] bg-[#FFF4F7] p-4 flex items-start gap-3">
                <Lock size={16} className="text-[#E5497C] mt-0.5" />
                <div className="text-[13px] text-[#4A4652]">
                  <p className="font-semibold text-[#1C1924]">Secure Razorpay checkout</p>
                  Pay safely via UPI, Cards, Netbanking or Wallets. Your transaction is encrypted and secured.
                </div>
              </div>
            </div>

            <button
              data-testid="checkout-submit"
              disabled={submitting}
              type="submit"
              className="btn-primary w-full justify-center mt-2 cursor-pointer"
            >
              {submitting ? "Placing your order…" : <>Pay & Place order <Gift size={16} /></>}
            </button>
          </div>

          <aside className="lg:col-span-5">
            <div className="glass-card-lavender rounded-[22px] p-6 sticky top-28">
              <p className="font-display font-semibold text-[#1C1924]">Your gift, ready to fly</p>
              <div className="mt-4 space-y-3">
                {cart.map((i) => (
                  <div key={i.id} className="flex items-center gap-3">
                    <img src={i.image} alt={i.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#1C1924] line-clamp-1">
                        {i.name}
                      </p>
                      <p className="text-[12px] text-[#4A4652]">Qty {i.qty}</p>
                    </div>
                    <span className="text-[13px] font-semibold text-[#1C1924]">
                      {formatINR(i.price * i.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/60 space-y-1.5 text-[13.5px] text-[#4A4652]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? "Free" : formatINR(totals.shipping)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/60 flex items-baseline justify-between">
                <span className="font-display text-[#1C1924]">Total</span>
                <span data-testid="checkout-total" className="font-display text-2xl font-semibold text-[#1C1924]">
                  {formatINR(totals.total)}
                </span>
              </div>
              {note && (
                <div className="mt-5 rounded-[16px] p-4 bg-white/70 note-preview">
                  <p className="text-[11px] text-[#8b8790] uppercase tracking-widest font-semibold">
                    Your note
                  </p>
                  <p className="font-handwritten text-[20px] text-[#1C1924] leading-snug whitespace-pre-wrap mt-1">
                    {note}
                  </p>
                </div>
              )}
              <Link to="/cart" className="mt-4 block text-center text-[13px] text-[#4A4652] underline">
                ← Back to cart
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
