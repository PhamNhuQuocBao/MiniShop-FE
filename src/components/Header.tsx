'use client';
import Link from 'next/link';
import {useCart} from './CartProvider';
export function Header(){const {items}=useCart();return <header className="header"><div className="wrap nav"><Link href="/" className="brand">Mini<span>Shop</span></Link><nav><Link href="/">Sản phẩm</Link><Link href="/cart">Giỏ hàng ({items.reduce((n,i)=>n+i.quantity,0)})</Link><Link href="/account">Tài khoản</Link></nav></div></header>}
