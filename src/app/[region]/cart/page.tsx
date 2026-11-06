import { notFound } from 'next/navigation';
import CartPage from '@/app/cart/page';
import { isRegion } from '@/lib/region';
export default async function RegionCart({ params }: { params: Promise<{ region: string }> }) {
  if (!isRegion((await params).region)) notFound();
  return <CartPage />;
}
