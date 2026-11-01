import {redirect} from 'next/navigation';
import {currentUser} from '@/lib/auth';
import {logoutAction} from '@/lib/actions';
export const dynamic='force-dynamic';
export default async function Account(){const user=await currentUser();if(!user)redirect('/login');return <div className="wrap page narrow"><h1>Tài khoản</h1><div className="summary"><p><strong>{user.name}</strong></p><p>{user.email}</p><p>Vai trò: {user.role==='admin'?'Quản trị':'Khách hàng'}</p><p>Phiên đăng nhập đang hoạt động.</p><form action={async()=>{'use server';await logoutAction();redirect('/login')}}><button>Đăng xuất</button></form></div></div>}
