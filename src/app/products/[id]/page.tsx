import { ProductDetail } from '@/components/ProductDetail';
export const dynamic='force-dynamic';
export default async function ProductPage({params}:{params:Promise<{id:string}>}){return <ProductDetail id={(await params).id}/>}
