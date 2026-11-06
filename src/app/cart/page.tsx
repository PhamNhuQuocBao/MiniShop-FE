'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { productVisual } from '@/components/ProductCard';
import { money } from '@/lib/api';
import { regionPrefix } from '@/lib/region';

export default function CartPage() {
  const prefix = regionPrefix(usePathname());
  const { cart, items, ready, busy, error, setQuantity, remove, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const quantity = items.reduce((total, item) => total + item.quantity, 0);

  return <div className="wrap page">
    <span className="eyebrow">BƯỚC 1 / 2 · GIỎ HÀNG</span>
    <h1>Giỏ hàng của bạn</h1>
    {!ready ? <div className="notice">Đang tải giỏ hàng...</div> : items.length ? <div className="twoCol">
      <div className="cartList">{items.map(({ lineId, product, quantity: lineQuantity }) => <div className="cartRow" key={lineId}>
        <div className="miniArt" aria-hidden="true">{productVisual(product)}</div>
        <div><Link href={`${prefix}/products/${product.id}`}><strong>{product.name}</strong></Link><p>{money(product.price)}</p><button className="linkBtn" disabled={busy} onClick={() => void remove(lineId)}>Xóa sản phẩm</button></div>
        <label>Số lượng<input type="number" min="1" max={product.stock} value={lineQuantity} disabled={busy} onChange={event => void setQuantity(lineId, Number(event.target.value) || 1)}/></label>
      </div>)}</div>
      <aside className="summary"><h2>Tóm tắt đơn hàng</h2>
        <div className="summaryLine"><span>Sản phẩm ({quantity})</span><strong>{money(cart.subtotal)}</strong></div>
        <form onSubmit={async event => { event.preventDefault(); if (await applyCoupon(code)) setCode(''); }}><label>Mã giảm giá<input value={code} onChange={event => setCode(event.target.value)} placeholder="Nhập mã coupon" required/></label><button disabled={busy}>Áp dụng</button></form>
        {cart.appliedCoupons.map(coupon => <div className="couponRow" key={coupon}><span>{coupon}</span><button className="linkBtn" disabled={busy} onClick={() => void removeCoupon(coupon)}>Xóa</button></div>)}
        {cart.discounts.map(discount => <div className="summaryLine" key={discount.code}><span>Giảm giá {discount.code}</span><strong>−{money(discount.amount)}</strong></div>)}
        {error && <p className="errorText" role="alert">{error}</p>}
        <div className="summaryTotal"><span>Tổng cộng</span><strong>{money(cart.total)}</strong></div>
        <Link className="button" href={`${prefix}/checkout`}>Tiếp tục đặt hàng <span aria-hidden="true">→</span></Link>
        <small>Đơn hàng mẫu, không có thanh toán trực tuyến.</small>
      </aside>
    </div> : <div className="notice emptyState"><span className="emptyStateIcon" aria-hidden="true">🛒</span><h2>Giỏ hàng đang trống</h2><p>Khám phá phụ kiện công nghệ và thêm món đồ bạn thích.</p><Link className="button" href={`${prefix}/products`}>Xem sản phẩm</Link></div>}
    {error && !items.length && <p className="errorText" role="alert">{error}</p>}
  </div>;
}
