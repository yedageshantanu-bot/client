import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  type CheckoutPayload,
} from "./authApi";
import type { Order } from "./types";

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal: {
    ondismiss: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", callback: (response: unknown) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

const loadRazorpayScript = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout can only run in the browser"));
  }

  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Could not load Razorpay checkout"));
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
};

export const payWithRazorpay = async (orderData: CheckoutPayload): Promise<Order> => {
  await loadRazorpayScript();

  const created = await createRazorpayOrder(orderData);
  const key = created.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const RazorpayCheckout = window.Razorpay;

  if (!RazorpayCheckout || !key) {
    throw new Error("Razorpay checkout is not available");
  }

  return new Promise<Order>((resolve, reject) => {
    let completed = false;

    const checkout = new RazorpayCheckout({
      key,
      amount: created.razorpayOrder.amount,
      currency: created.razorpayOrder.currency,
      name: "VastraAura",
      description: "Online payment",
      order_id: created.razorpayOrder.id,
      prefill: created.customer,
      theme: {
        color: "#7c2434",
      },
      modal: {
        ondismiss: () => {
          if (!completed) {
            reject(new Error("Payment failed. Please try again."));
          }
        },
      },
      handler: async (response) => {
        completed = true;
        try {
          const verified = await verifyRazorpayPayment({
            ...response,
            orderData,
          });
          resolve(verified.order);
        } catch (error) {
          reject(error);
        }
      },
    });

    checkout.on("payment.failed", () => {
      completed = true;
      reject(new Error("Payment failed. Please try again."));
    });

    checkout.open();
  });
};
