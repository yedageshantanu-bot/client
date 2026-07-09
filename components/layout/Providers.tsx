"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { StoreProvider } from "@/context/StoreContext";
import { LoginModal } from "./LoginModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          {children}
          <LoginModal />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                border: "1px solid #E8E0D0",
                color: "#1A1A1A",
                borderRadius: "8px",
              },
            }}
          />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
