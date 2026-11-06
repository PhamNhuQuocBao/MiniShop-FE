import { notFound } from 'next/navigation';
import { StorefrontHome } from '@/components/StorefrontHome';
import { isRegion } from '@/lib/region';
export const dynamic = 'force-dynamic';
export default async function RegionHome({ params, searchParams }: { params: Promise<{ region: string }>; searchParams: Promise<{ q?: string }> }) {
  const { region } = await params;
  if (!isRegion(region)) notFound();
  return <StorefrontHome q={(await searchParams).q || ''} prefix={`/${region}`} />;
}
