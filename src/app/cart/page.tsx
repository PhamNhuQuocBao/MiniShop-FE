'use client';
import Link from 'next/link';
import {useCart} from '@/components/CartProvider';
import {money} from '@/lib/api';
import {icon} from '@/components/ProductCard';
export default function CartPage(){const {items,setQuantity,remove}=useCart();const total=items.reduce((n,i)=>n+i.product.price*i.quantity,0);return <div className="wrap page"><h1>Giỏ hàng</h1>{items.length?<div className="twoCol"><div>{items.map(({product:p,quantity:q})=><div className="cartRow" key={p.id}><div className="miniArt">{icon(p.image)}</div><div><Link href={`/products/${p.id}`}><strong>{p.name}</strong></Link><p>{money(p.price)}</p><button className="linkBtn" onClick={()=>remove(p.id)}>Xóa</button></div><label>Số lượng<input type="number" min="1" max={p.stock} value={q} onChange={e=>setQuantity(p.id,Number(e.target.value)||1)}/></label></div>)}</div><aside className="summary"><h2>Tóm tắt</h2><p>{items.length} mặt hàng</p><strong>Tạm tính: {money(total)}</strong><Link className="button" href="/checkout">Tiếp tục đặt hàng</Link></aside></div>:<div className="notice">Giỏ hàng đang trống. <Link href="/">Xem sản phẩm</Link></div>}</div>}
