import { StorefrontHome } from '@/components/StorefrontHome';
import { getDevice, getVariant } from '@/lib/experiment';
export const dynamic='force-dynamic';
export default async function Home({searchParams}:{searchParams:Promise<{q?:string}>}){const [params,variant,device]=await Promise.all([searchParams,getVariant(),getDevice()]);return <StorefrontHome q={params.q||''} variant={variant} device={device}/>}
