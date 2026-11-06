import { StorefrontHome } from '@/components/StorefrontHome';
import { getDevice, getVariant } from '@/lib/experiment';
export const dynamic = 'force-dynamic';
export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [query, variant, device] = await Promise.all([searchParams, getVariant(), getDevice()]);
  return <StorefrontHome q={query.q || ''} variant={variant} device={device} page="plp" />;
}
