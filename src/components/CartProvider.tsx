'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Product } from '@/lib/api';
import { addCartItemAction, applyCouponAction, getCartAction, removeCartItemAction, removeCouponAction, updateCartItemAction, type CartResult, type CartView } from '@/lib/cart-actions';

type CartContext = {
  cart: CartView; items: CartView['lines']; ready: boolean; busy: boolean; error: string;
  add: (product: Product, quantity: number) => Promise<boolean>;
  setQuantity: (lineId: string, quantity: number) => Promise<boolean>;
  remove: (lineId: string) => Promise<boolean>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: (code: string) => Promise<boolean>;
  clear: () => void;
};

const empty: CartView = { lines: [], appliedCoupons: [], subtotal: 0, discounts: [], total: 0 };
const Context = createContext<CartContext | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cart, setCart] = useState<CartView>(empty);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setReady(false);
    setCart(empty);
    getCartAction().then(result => {
      if (!active) return;
      if (result.cart) setCart(result.cart);
      setError(result.error || '');
      setReady(true);
    }).catch(reason => {
      if (!active) return;
      setError(reason instanceof Error ? reason.message : 'Không tải được giỏ hàng');
      setReady(true);
    });
    return () => { active = false; };
  }, [pathname]);

  const update = async (action: () => Promise<CartResult>) => {
    setBusy(true);
    setError('');
    try {
      const result = await action();
      if (result.cart) { setCart(result.cart); return true; }
      setError(result.error || 'Không cập nhật được giỏ hàng');
      return false;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không cập nhật được giỏ hàng');
      return false;
    } finally { setBusy(false); }
  };

  return <Context.Provider value={{
    cart, items: cart.lines, ready, busy, error,
    add: (product, quantity) => update(() => addCartItemAction(product.id, quantity)),
    setQuantity: (lineId, quantity) => update(() => updateCartItemAction(lineId, quantity)),
    remove: lineId => update(() => removeCartItemAction(lineId)),
    applyCoupon: code => update(() => applyCouponAction(code)),
    removeCoupon: code => update(() => removeCouponAction(code)),
    clear: () => { setCart(empty); setError(''); },
  }}>{children}</Context.Provider>;
}

export function useCart() {
  const context = useContext(Context);
  if (!context) throw new Error('CartProvider missing');
  return context;
}
