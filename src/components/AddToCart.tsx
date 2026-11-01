'use client';
import {useState} from 'react';
import type {Product} from '@/lib/api';
import {useCart} from './CartProvider';
export function AddToCart({product}:{product:Product}){const [q,setQ]=useState(1);const [added,setAdded]=useState(false);const {add}=useCart();return <div className="purchase"><label>Số lượng <input type="number" min="1" max={product.stock} value={q} onChange={e=>setQ(Math.max(1,Math.min(product.stock,Number(e.target.value)||1)))} /></label><button disabled={!product.stock} onClick={()=>{add(product,q);setAdded(true)}}>{product.stock?'Thêm vào giỏ':'Hết hàng'}</button>{added&&<p className="success">Đã thêm vào giỏ.</p>}</div>}
