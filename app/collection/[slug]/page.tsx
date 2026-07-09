import { mockProducts } from "@/lib/mockData";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

export default async function CollectionProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product =
    mockProducts.find((item) => item.slug === slug || item._id === slug) ?? null;

  return <ProductDetailClient productId={slug} initialProduct={product} />;
}
