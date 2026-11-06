'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SectionNav({ items, label }: { items: { href: string; text: string }[]; label: string }) {
  const pathname = usePathname();
  return <nav aria-label={label}>{items.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href || (item.href !== '/account' && item.href !== '/admin' && pathname.startsWith(`${item.href}/`)) ? 'page' : undefined}>{item.text}</Link>)}</nav>;
}
