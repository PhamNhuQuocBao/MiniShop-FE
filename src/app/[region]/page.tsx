import { notFound } from 'next/navigation';
import { StorefrontHome } from '@/components/StorefrontHome';
import { isRegion } from '@/lib/region';
import { getDevice, getVariant } from '@/lib/experiment';
export const dynamic = 'force-dynamic';
export default async function RegionHome({ params, searchParams }: { params: Promise<{ region: string }>; searchParams: Promise<{ q?: string }> }) {
  const { region } = await params;
  if (!isRegion(region)) notFound();
  const [query, variant, device] = await Promise.all([searchParams, getVariant(), getDevice()]);
  return <StorefrontHome q={query.q || ''} prefix={`/${region}`} variant={variant} device={device} />;
}
