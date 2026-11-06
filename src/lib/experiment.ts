import { cookies } from 'next/headers';

export type Variant = 'A' | 'B' | 'C';
export type Device = 'mobile' | 'desktop';

export async function getVariant(): Promise<Variant> {
  const value = (await cookies()).get('ab_variant')?.value;
  return value === 'B' || value === 'C' ? value : 'A';
}

export async function getDevice(): Promise<Device> {
  return (await cookies()).get('device')?.value === 'mobile' ? 'mobile' : 'desktop';
}
