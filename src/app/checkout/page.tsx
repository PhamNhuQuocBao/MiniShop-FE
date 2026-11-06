'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { placeOrderAction } from '@/lib/actions';
import { money, Order } from '@/lib/api';
import { regionPrefix } from '@/lib/region';

export default function Checkout() {
  const prefix = regionPrefix(usePathname());
  const { items, cart, ready, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const result = await placeOrderAction({
      shipping: { name: String(form.get('name')), phone: String(form.get('phone')), address: String(form.get('address')) },
      items: items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
    });
    setBusy(false);
    if (result.order) { setOrder(result.order); clear(); }
    else setError(result.error || 'Không đặt được hàng');
  }

  if (order) return <div className="wrap page"><div className="notice success checkoutSuccess">
    <span className="eyebrow">ĐÃ GỬI ĐƠN HÀNG</span><h1>Đặt hàng thành công</h1>
    <p>Cảm ơn bạn đã mua sắm tại MiniShop. Mã đơn hàng của bạn là <strong>{order.code}</strong>.</p>
    <p>Người nhận: <strong>{order.shipping.name}</strong></p>
    <ul>{order.items.map(item => <li key={item.productId}>{item.name} × {item.quantity} — {money(item.unitPrice * item.quantity)}</li>)}</ul>
    <p>Tạm tính: {money(order.subtotal)}</p>
    {order.discounts?.map(discount => <p key={discount.code}>{discount.code}: −{money(discount.amount)}</p>)}
    <p><strong>Tổng cộng: {money(order.total)}</strong></p>
    <Link className="button" href={prefix || '/'}>Tiếp tục mua sắm</Link>
  </div></div>;

  return <div className="wrap page"><span className="eyebrow">BƯỚC 2 / 2 · GIAO HÀNG</span><h1>Hoàn tất đặt hàng</h1>
    {!ready ? <div className="notice">Đang tải giỏ hàng...</div> : !items.length ? <div className="notice emptyState"><span className="emptyStateIcon" aria-hidden="true">🛒</span><h2>Giỏ hàng đang trống</h2><p>Thêm sản phẩm trước khi đặt hàng.</p><Link className="button" href={`${prefix}/products`}>Xem sản phẩm</Link></div> : <div className="twoCol">
      <form onSubmit={submit} className="form"><h2>Thông tin giao hàng</h2><p className="formHint">Điền thông tin người nhận để hoàn tất đơn hàng mẫu.</p>
        <label>Họ và tên<input name="name" autoComplete="name" required minLength={2} maxLength={100}/></label>
        <label>Số điện thoại<input name="phone" type="tel" autoComplete="tel" required minLength={8} maxLength={20}/></label>
        <label>Địa chỉ nhận hàng<input name="address" autoComplete="street-address" required minLength={8} maxLength={300}/></label>
        {error && <p className="errorText" role="alert">{error}</p>}
        <button disabled={busy}>{busy ? 'Đang gửi...' : 'Xác nhận đặt hàng'}</button>
      </form>
      <aside className="summary"><h2>Đơn hàng của bạn</h2>
        {items.map(item => <div className="summaryLine" key={item.product.id}><span>{item.product.name} × {item.quantity}</span><strong>{money(item.product.price * item.quantity)}</strong></div>)}
        <div className="summaryLine"><span>Tạm tính</span><strong>{money(cart.subtotal)}</strong></div>
        {cart.discounts.map(discount => <div className="summaryLine" key={discount.code}><span>Giảm giá {discount.code}</span><strong>−{money(discount.amount)}</strong></div>)}
        <div className="summaryTotal"><span>Tổng cộng</span><strong>{money(cart.total)}</strong></div>
        <small>Giá cuối cùng do máy chủ xác nhận. Không có thanh toán thật.</small>
      </aside>
    </div>}
  </div>;
}
