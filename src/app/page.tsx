import { StorefrontHome } from '@/components/StorefrontHome';
export const dynamic='force-dynamic';
export default async function Home({searchParams}:{searchParams:Promise<{q?:string}>}){return <StorefrontHome q={(await searchParams).q||''}/>}
