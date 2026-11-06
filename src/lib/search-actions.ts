'use server';

import { api, Product } from './api';

export type FilterNode = { field: 'name' | 'category' | 'price'; operator: 'contains' | 'eq' | 'gte' | 'lte'; value: string | number };

export async function searchProducts(filters: FilterNode[]): Promise<{ products: Product[]; error?: string }> {
  try { return await api<{ products: Product[] }>('/api/products/search', { method: 'POST', body: JSON.stringify({ filters }) }); }
  catch (error) { return { products: [], error: error instanceof Error ? error.message : 'Không tìm được sản phẩm' }; }
}
