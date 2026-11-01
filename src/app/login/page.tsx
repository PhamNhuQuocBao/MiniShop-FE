'use client';
import {useActionState} from 'react';
import {useRouter} from 'next/navigation';
import {loginAction} from '@/lib/actions';
export default function Login(){const router=useRouter();const [state,action,pending]=useActionState(async(prev:{error:string;ok:boolean},form:FormData)=>{const result=await loginAction(prev,form);if(result.ok){const target=new URLSearchParams(window.location.search).get('next');router.push(target?.startsWith('/')&&!target.startsWith('//')?target:'/account');router.refresh()}return result},{error:'',ok:false});return <div className="wrap page narrow"><h1>Đăng nhập</h1><form action={action} className="form"><label>Email<input type="email" name="email" required autoComplete="username"/></label><label>Mật khẩu<input type="password" name="password" required autoComplete="current-password"/></label>{state.error&&<p className="errorText">{state.error}</p>}<button disabled={pending}>{pending?'Đang đăng nhập...':'Đăng nhập'}</button></form></div>}
