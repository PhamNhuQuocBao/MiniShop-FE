import { accountApi } from '@/lib/account-api';
import type { Order } from '@/lib/api';
import { OrderList } from '@/components/OrderViews';

export const dynamic = 'force-dynamic';
export default async function AccountOrders() {
  let orders: Order[] = [];
  let error = '';
  try { orders = (await accountApi<{ orders: Order[] }>('/api/account/orders')).orders; }
  catch (reason) { error = reason instanceof Error ? reason.message : 'Không tải được đơn hàng'; }
  return <div className="page"><h1>Đơn hàng của tôi</h1>
    {error ? <p className="notice error">{error}</p> : <OrderList orders={orders} basePath="/account/orders" />}
  </div>;
}
