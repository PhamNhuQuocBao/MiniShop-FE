import Link from 'next/link';
import {api,Product,money} from '@/lib/api';
import {icon} from '@/components/ProductCard';
import {AddToCart} from '@/components/AddToCart';
export const dynamic='force-dynamic';
export default async function ProductPage({params}:{params:Promise<{id:string}>}){let product:Product;try{product=(await api<{product:Product}>(`/api/products/${(await params).id}`)).product}catch{return <div className="wrap notice error">Không tìm thấy sản phẩm hoặc API chưa sẵn sàng. <Link href="/">Về cửa hàng</Link></div>}return <div className="wrap"><div className="breadcrumbs"><Link href="/">Cửa hàng</Link> / {product.name}</div><div className="detail"><div className="detailArt">{icon(product.image)}</div><div><span className="eyebrow">MINISHOP SELECTION</span><h1>{product.name}</h1><p className="lead">{product.description}</p><p className="price">{money(product.price)}</p><p>Còn {product.stock} sản phẩm</p><AddToCart product={product}/></div></div></div>}
