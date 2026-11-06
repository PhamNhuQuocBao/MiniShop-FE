'use server';

import { cookies } from 'next/headers';
import { api, Product } from './api';

export type CartView = { lines: { lineId: string; product: Product; quantity: number }[]; appliedCoupons: string[]; subtotal: number; discounts: { code: string; amount: number }[]; total: number };
export type CartResult = { cart?: CartView; error?: string };
const guestCookie = 'minishop_guest_cart';

export async function cartRequest(path: string, init?: RequestInit): Promise<CartView> {
  const jar = await cookies();
  const token = jar.get('minishop_session')?.value;
  const guest = jar.get(guestCookie)?.value;
  const data = await api<{ cart: CartView; guestToken?: string }>(path, {
    ...init,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(guest ? { Cookie: `${guestCookie}=${encodeURIComponent(guest)}` } : {}), ...init?.headers },
  });
  if (data.guestToken) jar.set(guestCookie, data.guestToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return data.cart;
}

const result = async (path: string, init?: RequestInit): Promise<CartResult> => {
  try { return { cart: await cartRequest(path, init) }; }
  catch (error) { return { error: error instanceof Error ? error.message : 'Không cập nhật được giỏ hàng' }; }
};

export async function getCartAction() { return result('/api/cart'); }
export async function addCartItemAction(productId: string, quantity: number) { return result('/api/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }); }
export async function updateCartItemAction(lineId: string, quantity: number) { return result(`/api/cart/items/${encodeURIComponent(lineId)}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }); }
export async function removeCartItemAction(lineId: string) { return result(`/api/cart/items/${encodeURIComponent(lineId)}`, { method: 'DELETE' }); }
export async function applyCouponAction(code: string) { return result('/api/cart/coupons', { method: 'POST', body: JSON.stringify({ code }) }); }
export async function removeCouponAction(code: string) { return result(`/api/cart/coupons/${encodeURIComponent(code)}`, { method: 'DELETE' }); }
