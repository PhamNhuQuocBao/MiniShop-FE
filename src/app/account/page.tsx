import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { logoutAction } from '@/lib/actions';

export const dynamic = 'force-dynamic';
export default async function Account({ searchParams }: { searchParams: Promise<{ forbidden?: string }> }) {
  const user = await currentUser();
  if (!user) redirect('/login');
  const forbidden = (await searchParams).forbidden === '1';
  return <div className="page"><span className="eyebrow">TÀI KHOẢN</span><h1>Xin chào, {user.name}</h1>
    {forbidden && <p className="notice error">Chỉ quản trị viên được xem dashboard.</p>}
    <div className="summary accountOverview"><h2>Thông tin tài khoản</h2><p><strong>{user.name}</strong></p><p>{user.email}</p>
      <p>Vai trò: {user.role === 'ADMIN' ? 'Quản trị' : 'Khách hàng'}</p>
      <p>Phiên đăng nhập đang hoạt động.</p>
      <p><Link className="button" href="/account/orders">Xem đơn hàng <span aria-hidden="true">→</span></Link></p>
      {user.role === 'ADMIN' && <p><Link href="/admin">Mở trang quản trị</Link></p>}
      <form action={async () => { 'use server'; await logoutAction(); redirect('/login'); }}><button>Đăng xuất</button></form>
    </div>
  </div>;
}
