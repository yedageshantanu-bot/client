import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="container-page py-28">Loading collection...</div>}>
      <ShopClient />
    </Suspense>
  );
}
