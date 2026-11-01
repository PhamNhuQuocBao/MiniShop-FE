'use client';
import {useActionState} from 'react';
import {useRouter} from 'next/navigation';
import {loginAction} from '@/lib/actions';
export default function Login(){const router=useRouter();const [state,action,pending]=useActionState(async(prev:{error:string;ok:boolean},form:FormData)=>{const next=await loginAction(prev,form);if(next.ok){router.push('/account');router.refresh()}return next},{error:'',ok:false});return <div className="wrap page narrow"><h1>Đăng nhập</h1><form action={action} className="form"><label>Email<input type="email" name="email" required autoComplete="username"/></label><label>Mật khẩu<input type="password" name="password" required autoComplete="current-password"/></label>{state.error&&<p className="errorText">{state.error}</p>}<button disabled={pending}>{pending?'Đang đăng nhập...':'Đăng nhập'}</button></form></div>}
