'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/api';
import type { Device, Variant } from '@/lib/experiment';
import { searchProducts, type FilterNode } from '@/lib/search-actions';

export function ProductSearchResults({ initialProducts, initialQuery, initialError, prefix, variant, device }: { initialProducts: Product[]; initialQuery: string; initialError: string; prefix: string; variant: Variant; device: Device }) {
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const filters: FilterNode[] = [];
    const name = String(data.get('q') || '').trim();
    const category = String(data.get('category') || '');
    const minPrice = String(data.get('minPrice') || '');
    const maxPrice = String(data.get('maxPrice') || '');
    if (name) filters.push({ field: 'name', operator: 'contains', value: name });
    if (category) filters.push({ field: 'category', operator: 'eq', value: category });
    if (minPrice) filters.push({ field: 'price', operator: 'gte', value: Number(minPrice) });
    if (maxPrice) filters.push({ field: 'price', operator: 'lte', value: Number(maxPrice) });
    setBusy(true);
    const result = await searchProducts(filters);
    setBusy(false);
    setProducts(result.products);
    setError(result.error || '');
  }
  return <>
    <form className="productFilters" onSubmit={submit}>
      <label>Tên sản phẩm<input name="q" defaultValue={initialQuery} placeholder="Tìm theo tên..."/></label>
      <label>Danh mục<select name="category" defaultValue=""><option value="">Tất cả</option><option value="input">Thiết bị nhập</option><option value="audio">Âm thanh</option><option value="desk">Bàn làm việc</option><option value="connectivity">Kết nối</option><option value="video">Hình ảnh</option></select></label>
      <label>Giá từ<input name="minPrice" type="number" min="0" placeholder="0"/></label>
      <label>Đến<input name="maxPrice" type="number" min="0" placeholder="Không giới hạn"/></label>
      <button disabled={busy}>{busy ? 'Đang tìm...' : 'Tìm kiếm'}</button>
    </form>
    {!error && <p className="resultsMeta" role="status">{products.length} sản phẩm phù hợp</p>}
    {error ? <div className="notice error">{error}</div> : products.length ? <div className={`grid experimentGrid experimentGrid--${variant.toLowerCase()} plpGrid plpGrid--${device}`}>{products.map(product => <ProductCard key={product.id} product={product} prefix={prefix}/>)}</div> : <div className="notice emptyState"><span className="emptyStateIcon" aria-hidden="true">⌕</span><h2>Chưa tìm thấy sản phẩm</h2><p>Thử đổi tên, danh mục hoặc khoảng giá để xem thêm lựa chọn.</p></div>}
  </>;
}
