import Link from 'next/link';
import type {Product} from '@/lib/api';
import {money} from '@/lib/api';
export function ProductCard({product:p}:{product:Product}){return <Link className="card" href={`/products/${p.id}`}><div className="productArt">{icon(p.image)}</div><div className="cardBody"><small>PHỤ KIỆN CÔNG NGHỆ</small><h3>{p.name}</h3><p>{p.description}</p><div className="cardBottom"><strong>{money(p.price)}</strong><span>Xem chi tiết →</span></div></div></Link>}
export function icon(name:string){return ({mouse:'🖱️',keyboard:'⌨️',headphones:'🎧',hub:'🔌',stand:'💻',cable:'🔋',webcam:'📷',mat:'◼️'} as Record<string,string>)[name]||'📦'}
