import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { ProfileForm } from '@/components/AccountForms';

export const dynamic = 'force-dynamic';
export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  return <div className="page"><h1>Hồ sơ</h1><ProfileForm user={user} /></div>;
}
