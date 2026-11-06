import {redirect} from 'next/navigation';
import {cookies} from 'next/headers';
import {api,money} from '@/lib/api';
import {currentUser} from '@/lib/auth';
import Link from 'next/link';
export const dynamic='force-dynamic';
export default async function Admin(){const user=await currentUser();if(!user)redirect('/login');if(user.role!=='admin')return <div className="wrap page notice error">Bạn không có quyền xem trang này.</div>;let data:{summary:{productCount:number;orderCount:number;revenue:number}};try{const token=(await cookies()).get('minishop_session')?.value;data=await api('/api/admin/summary',{headers:{Authorization:`Bearer ${token}`}})}catch{return <div className="wrap page notice error">Không tải được báo cáo.</div>}return <div className="wrap page"><span className="eyebrow">QUẢN TRỊ</span><h1>Tổng quan cửa hàng</h1><p><Link href="/admin/marketing" className="button">Marketing scripts</Link></p><div className="stats"><div><small>Sản phẩm</small><strong>{data.summary.productCount}</strong></div><div><small>Đơn hàng</small><strong>{data.summary.orderCount}</strong></div><div><small>Doanh thu mẫu</small><strong>{money(data.summary.revenue)}</strong></div></div></div>}
