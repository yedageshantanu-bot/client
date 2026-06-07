import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { normalizeProduct } from "@/lib/productMedia";
import { mockProducts } from "@/lib/mockData";
import type { Product } from "@/lib/types";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  const fetchProduct = async (): Promise<Product | null> => {
    try {
      const response = await fetch(`${apiBase}/products/${id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as { success?: boolean; product?: Product };
      return payload.success && payload.product ? normalizeProduct(payload.product) : null;
    } catch {
      return null;
    }
  };

  const remoteProduct = await fetchProduct();
  const product = remoteProduct ?? mockProducts.find((item) => item._id === id) ?? null;

  return <ProductDetailClient productId={id} initialProduct={product} />;
}
