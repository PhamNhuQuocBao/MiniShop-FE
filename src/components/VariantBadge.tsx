import { getDevice, getVariant } from '@/lib/experiment';

export async function VariantBadge() {
  const [variant, device] = await Promise.all([getVariant(), getDevice()]);
  return <span className="variantBadge">Variant {variant} · {device === 'mobile' ? 'Mobile' : 'Desktop'}</span>;
}
