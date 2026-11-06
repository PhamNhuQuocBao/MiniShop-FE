import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/login');
  return <div className="wrap accountShell">
    <aside className="accountSidebar"><h2>Tài khoản</h2><p>{user.name}</p><nav>
      <Link href="/account">Tổng quan</Link>
      <Link href="/account/orders">Đơn hàng</Link>
      <Link href="/account/profile">Hồ sơ</Link>
      <Link href="/account/addresses">Địa chỉ</Link>
      {user.role === 'ADMIN' && <Link href="/admin">Quản trị</Link>}
    </nav></aside><div className="accountContent">{children}</div>
  </div>;
}
