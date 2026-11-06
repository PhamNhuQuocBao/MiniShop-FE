import Link from 'next/link';
import { api, money, Product } from '@/lib/api';
import { AdminProductPicker } from '@/components/AdminProductPicker';

export const dynamic = 'force-dynamic';
export default async function AdminProducts() {
  let products: Product[] = [];
  let error = '';
  try { products = (await api<{ products: Product[] }>('/api/products')).products; }
  catch (reason) { error = reason instanceof Error ? reason.message : 'Không tải được sản phẩm'; }
  return <div className="wrap page"><span className="eyebrow">QUẢN TRỊ</span><h1>Sản phẩm</h1>
    {!error && <AdminProductPicker initialProducts={products}/>}
    {error ? <p className="notice error">{error}</p> : products.length ? <div className="marketingTableWrap"><table className="marketingTable"><thead><tr>
      <th>Tên</th><th>Giá</th><th>Tồn kho</th>
    </tr></thead><tbody>{products.map(product => <tr key={product.id}>
      <td><Link href={`/products/${product.id}`} className="orderLink">{product.name}</Link></td>
      <td>{money(product.price)}</td><td>{product.stock}</td>
    </tr>)}</tbody></table></div> : <p className="notice">Chưa có sản phẩm.</p>}
  </div>;
}
