import Link from 'next/link';
import type {Product} from '@/lib/api';
import {money} from '@/lib/api';
export function ProductCard({product:p,prefix=''}:{product:Product;prefix?:string}){return <Link className="card" href={`${prefix}/products/${p.id}`}><div className="productArt">{productVisual(p)}<span className="productTag">MiniShop chọn</span></div><div className="cardBody"><small>PHỤ KIỆN CÔNG NGHỆ</small><h3>{p.name}</h3><p>{p.description}</p><div className="cardBottom"><strong>{money(p.price)}</strong><span>Xem chi tiết <span aria-hidden="true">↗</span></span></div></div></Link>}
export function productVisual(product:Product,loading:'lazy'|'eager'='lazy'){return product.image.startsWith('/')?<img src={product.image} alt={product.name} className="supplierImage" loading={loading}/>:product.supplierImageUrl?<img src={`/api/img?src=${encodeURIComponent(product.supplierImageUrl)}`} alt={product.name} className="supplierImage" loading={loading}/>:icon(product.image)}
export function icon(name:string){return ({mouse:'🖱️',keyboard:'⌨️',headphones:'🎧',hub:'🔌',stand:'💻',cable:'🔋',webcam:'📷',mat:'◼️'} as Record<string,string>)[name]||'📦'}
