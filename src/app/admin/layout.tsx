import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { SectionNav } from '@/components/SectionNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Local study build places the admin page gate in Middleware for CVE-2026-44575.
  if (process.env.LOCAL_CVE_MODE !== '1') {
    const user = await currentUser();
    if (!user) redirect('/login');
    if (user.role !== 'ADMIN') redirect('/');
  }
  return <div className="adminShell"><div className="adminNav wrap"><SectionNav label="Điều hướng quản trị" items={[
    { href: '/admin', text: 'Tổng quan' },
    { href: '/admin/orders', text: 'Đơn hàng' },
    { href: '/admin/products', text: 'Sản phẩm' },
    { href: '/admin/marketing', text: 'Marketing' },
  ]}/></div>{children}</div>;
}
