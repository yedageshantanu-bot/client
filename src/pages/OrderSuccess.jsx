import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";
import { Check, Heart, Sparkles } from "lucide-react";

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderNumber}`)
      .then((r) => {
        const ord = r.data.order || r.data;
        if (ord) {
          setOrder({
            items: ord.products?.map(p => ({
              product_id: p.productId,
              name: p.title,
              image: p.image,
              price: p.price,
              qty: p.quantity
            })) || [],
            total: ord.total,
            customer_name: ord.customerInfo?.name || ord.shippingAddress?.fullName || "",
            address: ord.shippingAddress?.address || "",
            city: ord.shippingAddress?.city || "",
            country: ord.shippingAddress?.country || "India",
            zip: ord.shippingAddress?.pincode || "",
            personalized_note: ord.personalized_note || ""
          });
        }
      })
      .catch(() => setOrder(null));
  }, [orderNumber]);

  return (
    <main data-testid="order-success-page" className="pt-28 min-h-screen hero-mesh grain-overlay">
      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white grid place-items-center shadow-sm"><Check className="text-[#E5497C]" /></div>
        <p className="overline mt-6">Order confirmed</p>
        <h1 className="mt-3 font-display font-semibold text-[#1C1924] text-4xl md:text-5xl tracking-tight">Love is on its way</h1>
        <p className="mt-4 text-[#4A4652] max-w-xl mx-auto">
          Thank you for trusting Alaira House with your moment. We’ll pack it with care, add your handwritten note, and send it off with utmost care.
        </p>

        <div className="mt-10 glass-card rounded-[22px] p-6 md:p-8 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#8b8790] uppercase tracking-widest font-semibold">Order number</p>
              <p data-testid="order-number" className="font-display font-semibold text-[#1C1924] text-[18px]">{orderNumber}</p>
            </div>
            <Sparkles className="text-[#E5497C]" />
          </div>

          {order && (
            <>
              <div className="mt-6 space-y-3">
                {order.items.map((i) => (
                  <div key={i.product_id} className="flex items-center gap-3">
                    <img src={i.image} alt={i.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-[13.5px] font-semibold text-[#1C1924]">{i.name}</p>
                      <p className="text-[12px] text-[#4A4652]">Qty {i.qty}</p>
                    </div>
                    <span className="text-[13px] font-semibold text-[#1C1924]">{formatINR(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#EEE7FA] flex items-baseline justify-between">
                <span className="font-display text-[#1C1924]">Total paid</span>
                <span className="font-display text-2xl font-semibold text-[#1C1924]">{formatINR(order.total)}</span>
              </div>
              <div className="mt-4 text-[13px] text-[#4A4652]">
                Shipping to <span className="font-semibold text-[#1C1924]">{order.customer_name}</span>, {order.address}, {order.city}, {order.country} {order.zip}
              </div>
              {order.personalized_note && (
                <div className="mt-5 rounded-[16px] p-4 bg-white/70 note-preview">
                  <p className="text-[11px] text-[#8b8790] uppercase tracking-widest font-semibold flex items-center gap-1"><Heart size={11} className="text-[#E5497C]" /> Your note</p>
                  <p className="font-handwritten text-[22px] text-[#1C1924] leading-snug whitespace-pre-wrap mt-1">{order.personalized_note}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link to="/shop" data-testid="order-shop-again" className="btn-primary">Send another surprise</Link>
          <Link to="/" className="btn-ghost">Back home</Link>
        </div>
      </div>
    </main>
  );
}
