'use client';
import Link from 'next/link';
import {useCart} from './CartProvider';
import {usePathname} from 'next/navigation';
import {regionPrefix} from '@/lib/region';
export function Header(){const {items}=useCart();const prefix=regionPrefix(usePathname());return <header className="header"><div className="wrap nav"><Link href={prefix||'/'} className="brand">Mini<span>Shop</span></Link><nav><Link href={prefix||'/'}>Sản phẩm</Link><Link href={`${prefix}/cart`}>Giỏ hàng ({items.reduce((n,i)=>n+i.quantity,0)})</Link><Link href="/account">Tài khoản</Link></nav></div></header>}
