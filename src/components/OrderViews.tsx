import Link from 'next/link';
import { money, Order } from '@/lib/api';

const shippingLabels: Record<string, string> = {
  pending: 'Chờ xử lý', processing: 'Đang chuẩn bị', shipped: 'Đang giao',
  delivered: 'Đã giao', cancelled: 'Đã huỷ',
};

export function OrderList({ orders, basePath }: { orders: Order[]; basePath: string }) {
  if (!orders.length) return <p className="notice">Chưa có đơn hàng nào.</p>;
  return <div className="marketingTableWrap"><table className="marketingTable"><thead><tr>
    <th>Mã đơn</th><th>Ngày đặt</th><th>Khách hàng</th><th>Tổng tiền</th><th>Giao hàng</th>
  </tr></thead><tbody>{orders.map(order => <tr key={order.id}>
    <td><Link href={`${basePath}/${order.id}`} className="orderLink">{order.code}</Link></td>
    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
    <td>{order.shipping.name}</td><td>{money(order.total)}</td>
    <td>{shippingLabels[order.shippingStatus] || order.shippingStatus}</td>
  </tr>)}</tbody></table></div>;
}

export function OrderDetail({ order }: { order: Order }) {
  return <div className="orderDetail">
    <div className="summary"><h2>Giao hàng</h2><p>Trạng thái: <strong>{shippingLabels[order.shippingStatus] || order.shippingStatus}</strong></p>
      <p>Mã vận đơn: <strong>{order.trackingNumber || 'Chưa có'}</strong></p>
      <p>Người nhận: {order.shipping.name}</p><p>Điện thoại: {order.shipping.phone}</p><p>Địa chỉ: {order.shipping.address}</p></div>
    <div className="summary"><h2>Sản phẩm</h2>{order.items.map(item => <p key={item.productId}>
      {item.name} × {item.quantity} — {money(item.unitPrice * item.quantity)}
    </p>)}<p className="orderTotal">Tổng tiền: {money(order.total)}</p></div>
  </div>;
}
