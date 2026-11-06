import Link from 'next/link';
import { accountApi } from '@/lib/account-api';
import type { Order } from '@/lib/api';
import { OrderDetail } from '@/components/OrderViews';

export const dynamic = 'force-dynamic';
export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order: Order | null = null;
  let error = '';
  try { order = (await accountApi<{ order: Order }>(`/api/admin/orders/${encodeURIComponent(id)}`)).order; }
  catch (reason) { error = reason instanceof Error ? reason.message : 'Không tải được đơn hàng'; }
  return <div className="wrap page"><p><Link href="/admin/orders">← Tất cả đơn hàng</Link></p>
    {order ? <><span className="eyebrow">QUẢN TRỊ</span><h1>Đơn {order.code}</h1><OrderDetail order={order} /></> : <p className="notice error">{error}</p>}
  </div>;
}
