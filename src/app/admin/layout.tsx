import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/');
  return <div className="adminShell"><nav className="adminNav wrap">
    <Link href="/admin">Tổng quan</Link><Link href="/admin/orders">Đơn hàng</Link>
    <Link href="/admin/products">Sản phẩm</Link><Link href="/admin/marketing">Marketing</Link>
  </nav>{children}</div>;
}
