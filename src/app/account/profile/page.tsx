import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { ProfileForm } from '@/components/AccountForms';

export const dynamic = 'force-dynamic';
export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  return <div className="page"><span className="eyebrow">TÀI KHOẢN</span><h1>Hồ sơ cá nhân</h1><p className="lead">Cập nhật thông tin liên hệ của bạn.</p><ProfileForm user={user} /></div>;
}
