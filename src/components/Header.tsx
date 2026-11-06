'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { regionPrefix } from '@/lib/region';

export function Header({ isAdmin }: { isAdmin: boolean }) {
  const { items } = useCart();
  const pathname = usePathname();
  const prefix = regionPrefix(pathname);
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const productsPath = `${prefix}/products`;
  const cartPath = `${prefix}/cart`;

  return <header className="header">
    <div className="announcement"><div className="wrap">Phụ kiện công nghệ cho mỗi ngày làm việc tốt hơn <span aria-hidden="true">✦</span> MiniShop</div></div>
    <div className="wrap nav">
      <Link href={prefix || '/'} className="brand" aria-label="MiniShop, về trang chủ"><span className="brandMark" aria-hidden="true">M</span><span>Mini<span>Shop</span></span></Link>
      <nav aria-label="Điều hướng chính" className="mainNav">
        <Link href={prefix || '/'} aria-current={pathname === (prefix || '/') ? 'page' : undefined}>Trang chủ</Link>
        <Link href={productsPath} aria-current={pathname === productsPath ? 'page' : undefined}>Sản phẩm</Link>
        <Link href="/account" aria-current={pathname.startsWith('/account') ? 'page' : undefined}>Tài khoản</Link>
        {isAdmin && <Link href="/admin" aria-current={pathname.startsWith('/admin') ? 'page' : undefined}>Quản trị</Link>}
        <Link href={cartPath} className="cartNav" aria-current={pathname === cartPath ? 'page' : undefined}>Giỏ hàng <span className="cartCount">{count}</span></Link>
      </nav>
    </div>
  </header>;
}
