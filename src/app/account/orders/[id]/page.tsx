import Link from 'next/link';
import { accountApi } from '@/lib/account-api';
import type { Order } from '@/lib/api';
import { OrderDetail } from '@/components/OrderViews';

export const dynamic = 'force-dynamic';
export default async function AccountOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order: Order | null = null;
  let error = '';
  try { order = (await accountApi<{ order: Order }>(`/api/account/orders/${encodeURIComponent(id)}`)).order; }
  catch (reason) { error = reason instanceof Error ? reason.message : 'Không tải được đơn hàng'; }
  return <div className="page"><p><Link href="/account/orders">← Đơn hàng của tôi</Link></p>
    {order ? <><h1>Đơn {order.code}</h1><OrderDetail order={order} /></> : <p className="notice error">{error}</p>}
  </div>;
}
