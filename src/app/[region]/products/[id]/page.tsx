import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { isRegion } from '@/lib/region';
export const dynamic = 'force-dynamic';
export default async function RegionProduct({ params }: { params: Promise<{ region: string; id: string }> }) {
  const { region, id } = await params;
  if (!isRegion(region)) notFound();
  return <ProductDetail id={id} prefix={`/${region}`} />;
}
