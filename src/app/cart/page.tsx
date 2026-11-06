'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { icon } from '@/components/ProductCard';
import { money } from '@/lib/api';
import { regionPrefix } from '@/lib/region';

export default function CartPage() {
  const prefix = regionPrefix(usePathname());
  const { cart, items, ready, busy, error, setQuantity, remove, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  return <div className="wrap page"><h1>Giỏ hàng</h1>
    {!ready ? <div className="notice">Đang tải giỏ hàng...</div> : items.length ? <div className="twoCol">
      <div>{items.map(({ lineId, product, quantity }) => <div className="cartRow" key={lineId}>
        <div className="miniArt">{icon(product.image)}</div>
        <div><Link href={`${prefix}/products/${product.id}`}><strong>{product.name}</strong></Link><p>{money(product.price)}</p><button className="linkBtn" disabled={busy} onClick={() => void remove(lineId)}>Xóa</button></div>
        <label>Số lượng<input type="number" min="1" max={product.stock} value={quantity} disabled={busy} onChange={event => void setQuantity(lineId, Number(event.target.value) || 1)}/></label>
      </div>)}</div>
      <aside className="summary"><h2>Tóm tắt</h2><p>{items.length} mặt hàng</p><p>Tạm tính: {money(cart.subtotal)}</p>
        <form onSubmit={async event => { event.preventDefault(); if (await applyCoupon(code)) setCode(''); }}><label>Mã coupon<input value={code} onChange={event => setCode(event.target.value)} placeholder="Nhập mã giảm giá" required/></label><button disabled={busy}>Áp dụng</button></form>
        {cart.appliedCoupons.map(coupon => <div className="couponRow" key={coupon}><span>{coupon}</span><button className="linkBtn" disabled={busy} onClick={() => void removeCoupon(coupon)}>Xóa</button></div>)}
        {cart.discounts.map(discount => <p key={discount.code}>{discount.code}: −{money(discount.amount)}</p>)}
        {error && <p className="errorText">{error}</p>}
        <strong>Tổng sau giảm: {money(cart.total)}</strong><Link className="button" href={`${prefix}/checkout`}>Tiếp tục đặt hàng</Link>
      </aside>
    </div> : <div className="notice">Giỏ hàng đang trống. <Link href={prefix || '/'}>Xem sản phẩm</Link></div>}
    {error && !items.length && <p className="errorText">{error}</p>}
  </div>;
}
