import Link from 'next/link';
import { api, Product, money } from '@/lib/api';
import { productVisual } from '@/components/ProductCard';
import { AddToCart } from '@/components/AddToCart';

export async function ProductDetail({ id, prefix = '' }: { id: string; prefix?: string }) {
  let product: Product;
  try { product = (await api<{ product: Product }>(`/api/products/${id}`)).product; }
  catch { return <div className="wrap notice error">Không tìm thấy sản phẩm hoặc API chưa sẵn sàng. <Link href={prefix || '/'}>Về cửa hàng</Link></div>; }
  return <div className="wrap"><div className="breadcrumbs"><Link href={prefix || '/'}>Trang chủ</Link> / <Link href={`${prefix}/products`}>Sản phẩm</Link> / {product.name}</div><div className="detail"><div className="detailArt">{productVisual(product,'eager')}</div><div><span className="eyebrow">MINISHOP SELECTION</span><h1>{product.name}</h1><p className="lead">{product.description}</p><p className="price">{money(product.price)}</p><p className={product.stock ? 'stockLabel' : 'stockLabel stockLabel--empty'}>{product.stock ? `Còn ${product.stock} sản phẩm` : 'Tạm hết hàng'}</p><AddToCart product={product}/>{product.specifications?.length ? <section className="productSpecs"><h2>Thông số nổi bật</h2><ul>{product.specifications.map(specification => <li key={specification}>{specification}</li>)}</ul></section> : null}<p className="formHint">Giá hiển thị bằng VND. Thông tin đơn hàng được xác nhận khi đặt hàng.</p></div></div></div>;
}
