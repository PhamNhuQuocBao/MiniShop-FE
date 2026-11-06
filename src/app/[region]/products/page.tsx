import { notFound } from 'next/navigation';
import { StorefrontHome } from '@/components/StorefrontHome';
import { getDevice, getVariant } from '@/lib/experiment';
import { isRegion } from '@/lib/region';
export const dynamic = 'force-dynamic';
export default async function RegionProductsPage({ params, searchParams }: { params: Promise<{ region: string }>; searchParams: Promise<{ q?: string }> }) {
  const { region } = await params;
  if (!isRegion(region)) notFound();
  const [query, variant, device] = await Promise.all([searchParams, getVariant(), getDevice()]);
  return <StorefrontHome q={query.q || ''} prefix={`/${region}`} variant={variant} device={device} page="plp" />;
}
