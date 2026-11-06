'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/lib/actions';

export default function Login() {
  const router = useRouter();
  const [state, action, pending] = useActionState(async (previous: { error: string; ok: boolean }, form: FormData) => {
    const result = await loginAction(previous, form);
    if (result.ok) {
      const target = new URLSearchParams(window.location.search).get('next');
      router.push(target?.startsWith('/') && !target.startsWith('//') ? target : '/account');
      router.refresh();
    }
    return result;
  }, { error: '', ok: false });

  return <div className="wrap page narrow loginPage">
    <div className="loginIntro"><span className="eyebrow">TÀI KHOẢN MINISHOP</span><h1>Chào mừng trở lại</h1><p className="lead">Đăng nhập để xem đơn hàng và quản lý thông tin của bạn.</p></div>
    <form action={action} className="form"><h2>Đăng nhập</h2>
      <label>Email<input type="email" name="email" placeholder="ban@example.com" required autoComplete="username"/></label>
      <label>Mật khẩu<input type="password" name="password" placeholder="Nhập mật khẩu" required autoComplete="current-password"/></label>
      {state.error && <p className="errorText" role="alert">{state.error}</p>}
      <button disabled={pending}>{pending ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
    </form>
    <p className="loginAside">Đây là cửa hàng mẫu. Tài khoản dùng thử được ghi trong README của dự án.</p>
  </div>;
}
