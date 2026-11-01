'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import type {Product} from '@/lib/api';
type Item={product:Product;quantity:number};
type Cart={items:Item[];add:(p:Product,q:number)=>void;setQuantity:(id:string,q:number)=>void;remove:(id:string)=>void;clear:()=>void};
const C=createContext<Cart|null>(null);
export function CartProvider({children}:{children:React.ReactNode}){const [items,setItems]=useState<Item[]>([]);const [ready,setReady]=useState(false);useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('minishop_cart')||'[]');if(Array.isArray(saved))setItems(saved)}catch{}setReady(true)},[]);useEffect(()=>{if(ready)localStorage.setItem('minishop_cart',JSON.stringify(items))},[items,ready]);const add=(product:Product,quantity:number)=>setItems(old=>{const existing=old.find(i=>i.product.id===product.id);return existing?old.map(i=>i.product.id===product.id?{product,quantity:Math.min(product.stock,i.quantity+quantity)}:i):[...old,{product,quantity}]});const setQuantity=(id:string,q:number)=>setItems(old=>old.map(i=>i.product.id===id?{...i,quantity:Math.max(1,Math.min(i.product.stock,q))}:i));const remove=(id:string)=>setItems(old=>old.filter(i=>i.product.id!==id));return <C.Provider value={{items:ready?items:[],add,setQuantity,remove,clear:()=>setItems([])}}>{children}</C.Provider>}
export function useCart(){const c=useContext(C);if(!c)throw new Error('CartProvider missing');return c}
