import Link from 'next/link';
import { money } from '@/lib/api';

export const dynamic = 'force-dynamic';

// This fixture deliberately relies on Middleware for its route authorization.
// It contains no real customer, order, or backend data.
export default function Dashboard() {
  return <div className="wrap page">
    <span className="eyebrow">QUẢN TRỊ MẪU</span>
    <h1>Dashboard MiniShop</h1>
    <p className="lead">Số liệu minh họa cho môi trường lab.</p>
    <div className="stats">
      <div><small>Sản phẩm mẫu</small><strong>8</strong></div>
      <div><small>Đơn hàng mẫu</small><strong>12</strong></div>
      <div><small>Doanh thu mẫu</small><strong>{money(4200000)}</strong></div>
    </div>
    <p className="notice">Marker: <code>ADMIN_DEMO_ONLY</code>. <Link href="/account">Về tài khoản</Link></p>
  </div>;
}
