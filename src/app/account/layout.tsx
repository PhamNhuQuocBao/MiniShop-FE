import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { SectionNav } from '@/components/SectionNav';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/login');
  return <div className="wrap accountShell">
    <aside className="accountSidebar"><h2>Tài khoản</h2><p>{user.name}</p><SectionNav label="Điều hướng tài khoản" items={[
      { href: '/account', text: 'Tổng quan' },
      { href: '/account/orders', text: 'Đơn hàng' },
      { href: '/account/profile', text: 'Hồ sơ' },
      { href: '/account/addresses', text: 'Địa chỉ' },
      ...(user.role === 'ADMIN' ? [{ href: '/admin', text: 'Quản trị' }] : []),
    ]}/></aside><div className="accountContent">{children}</div>
  </div>;
}
