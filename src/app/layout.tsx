import Link from 'next/link';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { MarketingScripts } from '@/components/MarketingScripts';
import { VariantBadge } from '@/components/VariantBadge';
import { currentUser } from '@/lib/auth';

export const metadata = {
  title: 'MiniShop | Phụ kiện công nghệ',
  description: 'Phụ kiện công nghệ cho góc làm việc của bạn',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return <html lang="vi"><body>
    <MarketingScripts />
    <CartProvider>
      <Header isAdmin={user?.role === 'ADMIN'} />
      <main id="main-content">{children}</main>
      <footer className="footer"><div className="wrap footerMain">
        <div><Link href="/" className="brand footerBrand"><span className="brandMark" aria-hidden="true">M</span><span>Mini<span>Shop</span></span></Link><p>Những món đồ nhỏ giúp không gian làm việc của bạn tốt hơn mỗi ngày.</p></div>
        <div className="footerLinks"><span>Khám phá</span><Link href="/products">Sản phẩm</Link><Link href="/cart">Giỏ hàng</Link><Link href="/account">Tài khoản</Link></div>
        <div className="footerLinks"><span>Thông tin</span><small>Cửa hàng phụ kiện mẫu</small><small>Không có thanh toán thật</small></div>
      </div><div className="wrap footerBottom"><span>© MiniShop · Trải nghiệm mua sắm mẫu</span><VariantBadge /></div></footer>
    </CartProvider>
  </body></html>;
}
