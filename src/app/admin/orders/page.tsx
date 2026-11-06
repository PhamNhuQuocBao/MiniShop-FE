import { accountApi } from '@/lib/account-api';
import type { Order } from '@/lib/api';
import { OrderList } from '@/components/OrderViews';

export const dynamic = 'force-dynamic';
export default async function AdminOrders() {
  let orders: Order[] = [];
  let error = '';
  try { orders = (await accountApi<{ orders: Order[] }>('/api/admin/orders')).orders; }
  catch (reason) { error = reason instanceof Error ? reason.message : 'Không tải được đơn hàng'; }
  return <div className="wrap page"><span className="eyebrow">QUẢN TRỊ</span><h1>Tất cả đơn hàng</h1>
    {error ? <p className="notice error">{error}</p> : <OrderList orders={orders} basePath="/admin/orders" />}
  </div>;
}
