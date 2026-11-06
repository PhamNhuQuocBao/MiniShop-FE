'use client';

import { useState } from 'react';
import type { Product } from '@/lib/api';
import { money } from '@/lib/api';
import { searchProducts, type FilterNode } from '@/lib/search-actions';

export function AdminProductPicker({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const filters: FilterNode[] = [];
    const name = String(data.get('name') || '').trim();
    const category = String(data.get('category') || '');
    if (name) filters.push({ field: 'name', operator: 'contains', value: name });
    if (category) filters.push({ field: 'category', operator: 'eq', value: category });
    setBusy(true);
    const result = await searchProducts(filters);
    setBusy(false);
    setProducts(result.products);
    setSelected(null);
    setError(result.error || '');
  }
  return <section className="adminPicker"><h2>Chọn sản phẩm</h2><form className="productFilters" onSubmit={submit}>
    <label>Tên<input name="name" placeholder="Tên sản phẩm"/></label>
    <label>Danh mục<select name="category" defaultValue=""><option value="">Tất cả</option><option value="input">Thiết bị nhập</option><option value="audio">Âm thanh</option><option value="desk">Bàn làm việc</option><option value="connectivity">Kết nối</option><option value="video">Hình ảnh</option></select></label>
    <button disabled={busy}>{busy ? 'Đang tìm...' : 'Lọc sản phẩm'}</button>
  </form>
    {error && <p className="errorText">{error}</p>}
    <div className="pickerResults">{products.map(product => <button type="button" className={selected?.id === product.id ? 'pickerItem pickerItem--selected' : 'pickerItem'} key={product.id} onClick={() => setSelected(product)}>{product.name}</button>)}</div>
    {!error && !products.length && <p className="notice">Không có sản phẩm phù hợp.</p>}
    {selected && <p className="notice">Đã chọn: <strong>{selected.name}</strong> · {money(selected.price)} · Tồn kho {selected.stock}</p>}
  </section>;
}
