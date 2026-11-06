import { notFound } from 'next/navigation';
import Checkout from '@/app/checkout/page';
import { isRegion } from '@/lib/region';
export default async function RegionCheckout({ params }: { params: Promise<{ region: string }> }) {
  if (!isRegion((await params).region)) notFound();
  return <Checkout />;
}
