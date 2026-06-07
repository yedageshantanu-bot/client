"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";
import {
  brandAddressLines,
  brandEmail,
  brandName,
  brandPhone,
} from "@/lib/brand";

type OrderInvoiceProps = {
  order: Order;
  invoiceNumber?: string;
  invoiceDate?: string;
};

export function OrderInvoice({ order, invoiceNumber, invoiceDate }: OrderInvoiceProps) {
  const date = invoiceDate || new Date(order.date).toLocaleDateString("en-IN");
  const invNumber = invoiceNumber || `INV-${order.orderId.replace("VA", "")}-${new Date(order.date).getFullYear()}`;

  return (
    <div className="invoice-container mx-auto max-w-[800px] bg-white p-8 text-charcoal sm:p-12" id="invoice-content">
      {/* Header */}
      <div className="flex flex-col justify-between gap-8 border-b-2 border-[#e2e8f0] pb-10 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#0f172a] font-display text-2xl font-bold text-white">
            VA
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold leading-none text-[#0f172a]">{brandName}</h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-[#64748b] font-semibold">Premium Half Saree House</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-[#0f172a]">Invoice</h2>
          <div className="mt-4 grid gap-1 text-sm font-medium">
            <p><span className="text-[#64748b]">Invoice #:</span> {invNumber}</p>
            <p><span className="text-[#64748b]">Order #:</span> {order.orderId}</p>
            <p><span className="text-[#64748b]">Date:</span> {date}</p>
          </div>
        </div>
      </div>

      {/* Store & Customer Info */}
      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">Sold By</h3>
          <div className="text-sm leading-relaxed">
            <p className="font-bold text-[#0f172a]">{brandName}</p>
            {brandAddressLines.map((line) => (
              <p key={line} className="text-[#64748b]">{line}</p>
            ))}
            <p className="mt-2 text-[#64748b]"><span className="font-semibold text-[#0f172a]">Email:</span> {brandEmail}</p>
            <p className="text-[#64748b]"><span className="font-semibold text-[#0f172a]">Phone:</span> {brandPhone}</p>
            <p className="text-[#64748b] font-medium mt-1 uppercase tracking-tighter">GSTIN: 27AAGCA1234A1Z1 (Sample)</p>
          </div>
        </div>
        <div className="sm:text-right">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">Bill To / Ship To</h3>
          <div className="text-sm leading-relaxed">
            <p className="font-bold text-[#0f172a]">{order.shippingAddress.fullName || order.customer}</p>
            <p className="text-[#64748b]">{order.shippingAddress.address}</p>
            {order.shippingAddress.landmark && <p className="text-[#64748b]">Landmark: {order.shippingAddress.landmark}</p>}
            <p className="text-[#64748b]">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p className="text-[#64748b]">India - {order.shippingAddress.pincode}</p>
            <p className="mt-2 text-[#64748b]"><span className="font-semibold text-[#0f172a]">Phone:</span> {order.shippingAddress.phone || order.phone}</p>
            <p className="text-[#64748b]"><span className="font-semibold text-[#0f172a]">Email:</span> {order.userEmail}</p>
          </div>
        </div>
      </div>

      {/* Order Summary Header */}
      <div className="mt-12 overflow-hidden rounded-lg border border-[#e2e8f0]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#f8fafc] text-xs font-bold uppercase tracking-widest text-[#64748b]">
              <th className="px-6 py-4">Item Details</th>
              <th className="px-6 py-4 text-center">Qty</th>
              <th className="px-6 py-4 text-right">Rate</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {order.products.map((item, index) => (
              <tr key={`${item.productId}-${index}`} className="align-top">
                <td className="px-6 py-5">
                  <div className="flex gap-4">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded border border-[#e2e8f0] bg-ivory">
                      <Image
                        src={typeof item.image === "string" ? item.image : item.image.url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[#0f172a]">{item.title}</p>
                      <p className="mt-1 text-[10px] text-[#64748b] uppercase tracking-wider">
                        {item.color ? `Color: ${item.color}` : ""}
                        {item.size ? ` | Size: ${item.size}` : ""}
                      </p>
                      <p className="mt-1 text-[10px] text-[#64748b]">SKU: {String(item.productId || "").slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-medium text-[#0f172a]">{item.quantity}</td>
                <td className="px-6 py-5 text-right text-[#64748b]">{formatPrice(item.price)}</td>
                <td className="px-6 py-5 text-right font-bold text-[#0f172a]">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-8 flex flex-col justify-between gap-10 sm:flex-row">
        <div className="flex-1">
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Payment Info</h3>
            <div className="mt-4 grid gap-3 text-xs">
              <div className="flex justify-between border-b border-[#e2e8f0]/40 pb-2">
                <span className="text-[#64748b]">Method:</span>
                <span className="font-bold text-[#0f172a]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-[#e2e8f0]/40 pb-2">
                <span className="text-[#64748b]">Status:</span>
                <span className="font-bold text-[#0f172a]">{order.paymentStatus}</span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Transaction ID:</span>
                  <span className="font-medium text-[#0f172a]">{order.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]/30 p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">Coupon Details</h3>
            <div className="mt-4 text-xs">
              {order.couponCode ? (
                <div className="grid gap-2">
                  <p className="flex justify-between font-medium">
                    <span className="text-[#64748b]">Code:</span>
                    <span className="text-[#0f172a] font-bold">{order.couponCode}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[#64748b]">Discount:</span>
                    <span className="text-[#0f172a] font-bold">-{formatPrice(order.couponDiscount)}</span>
                  </p>
                </div>
              ) : (
                <p className="text-[#64748b] italic">No coupon applied</p>
              )}
            </div>
          </div>
        </div>

        <div className="min-w-[280px]">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#64748b]">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-[#0f172a]">
                <span>Discount ({order.couponCode})</span>
                <span className="font-medium">-{formatPrice(order.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#64748b]">
              <span>Shipping</span>
              <span className="font-medium">₹0.00</span>
            </div>
            <div className="flex justify-between text-[#64748b]">
              <span>Tax (GST)</span>
              <span className="font-medium">₹0.00</span>
            </div>
            <div className="my-4 h-px bg-[#f8fafc]" />
            <div className="flex justify-between text-xl font-bold text-[#0f172a]">
              <span className="font-display">Grand Total</span>
              <span className="font-sans tabular-nums price">{formatPrice(order.total)}</span>
            </div>
            <div className="mt-4 rounded-lg bg-[#0f172a] p-3 text-center text-[10px] font-bold uppercase tracking-widest text-white">
              Amount Paid: <span className="font-sans tabular-nums price">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 border-t border-[#e2e8f0] pt-10 text-center">
        <p className="font-display text-xl font-semibold text-[#0f172a]">Thank you for shopping with us!</p>
        <p className="mt-3 text-xs text-[#64748b] leading-relaxed">
          This is a computer-generated invoice and does not require a physical signature.<br />
          For any queries regarding this order, please contact our support at <span className="font-bold text-[#0f172a]">{brandEmail}</span>.
        </p>
        <div className="mt-8 flex justify-center gap-6 opacity-30">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#0f172a] font-display text-xs font-bold text-white">
            VA
          </div>
        </div>
      </div>
    </div>
  );
}





