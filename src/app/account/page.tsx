import Link from 'next/link';
import {redirect} from 'next/navigation';
import {currentUser} from '@/lib/auth';
import {logoutAction} from '@/lib/actions';
export const dynamic='force-dynamic';
export default async function Account({searchParams}:{searchParams:Promise<{forbidden?:string}>}){const user=await currentUser();if(!user)redirect('/login');const forbidden=(await searchParams).forbidden==='1';return <div className="wrap page narrow"><h1>Tài khoản</h1>{forbidden&&<p className="notice error">Chỉ quản trị viên được xem dashboard.</p>}<div className="summary"><p><strong>{user.name}</strong></p><p>{user.email}</p><p>Vai trò: {user.role==='admin'?'Quản trị':'Khách hàng'}</p><p>Phiên đăng nhập đang hoạt động.</p>{user.role==='admin'&&<p><Link className="button" href="/dashboard">Mở dashboard mẫu</Link></p>}<form action={async()=>{'use server';await logoutAction();redirect('/login')}}><button>Đăng xuất</button></form></div></div>}
