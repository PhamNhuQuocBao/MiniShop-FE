export type Product={id:string;name:string;slug:string;description:string;image:string;price:number;stock:number};
export type User={id:string;name:string;email:string;role:'customer'|'admin'};
export type Order={id:string;code:string;shipping:{name:string;phone:string;address:string};items:{productId:string;name:string;unitPrice:number;quantity:number}[];total:number;status:string};
const base=()=>process.env.API_BASE_URL || 'http://localhost:4000';
export async function api<T>(path:string,init?:RequestInit):Promise<T>{const res=await fetch(`${base()}${path}`,{...init,cache:'no-store',headers:{'Content-Type':'application/json',...init?.headers}});let data:any;try{data=await res.json()}catch{throw new Error('API không phản hồi hợp lệ')}if(!res.ok)throw new Error(data?.error?.message||`API lỗi ${res.status}`);return data as T;}
export const money=(n:number)=>new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(n);
