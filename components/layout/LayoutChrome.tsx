"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // The admin console provides its own top bar, sidebar, and bottom
    // padding via AdminShell. Hiding the storefront Navbar/Footer
    // prevents overlap and double scrollbars.
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
