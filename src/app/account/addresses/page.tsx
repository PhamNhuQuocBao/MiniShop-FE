import { accountApi } from '@/lib/account-api';
import type { Address } from '@/lib/api';
import { AddressForm } from '@/components/AccountForms';

export const dynamic = 'force-dynamic';
export default async function AddressesPage() {
  let addresses: Address[] = [];
  let error = '';
  try { addresses = (await accountApi<{ addresses: Address[] }>('/api/account/addresses')).addresses; }
  catch (reason) { error = reason instanceof Error ? reason.message : 'Không tải được địa chỉ'; }
  return <div className="page"><h1>Địa chỉ của tôi</h1>
    {error ? <p className="notice error">{error}</p> : addresses.length ? <div className="addressGrid">{addresses.map(address =>
      <div key={address.id} className="summary"><strong>{address.label}</strong><p>{address.name}</p><p>{address.phone}</p><p>{address.address}</p></div>
    )}</div> : <p className="notice">Bạn chưa lưu địa chỉ nào.</p>}
    <AddressForm />
  </div>;
}
