'use client';

import { useActionState } from 'react';
import { addAddressAction, updateProfileAction } from '@/lib/account-actions';
import type { AccountActionState } from '@/lib/account-actions';
import type { User } from '@/lib/api';

const initial: AccountActionState = { status: 0, message: '' };
const Message = ({ state }: { state: AccountActionState }) => state.message ?
  <p role="status" className={state.status >= 400 ? 'errorText' : 'success'}>{state.message}</p> : null;

export function ProfileForm({ user }: { user: User }) {
  const [state, action, pending] = useActionState(updateProfileAction, initial);
  return <form action={action} className="form accountForm">
    <label>Họ tên<input name="name" defaultValue={user.name} required minLength={2} maxLength={100} /></label>
    <label>Email<input type="email" name="email" defaultValue={user.email} required maxLength={254} /></label>
    <label>Số điện thoại<input name="phone" defaultValue={user.phone} placeholder="0901234567" minLength={8} maxLength={20} /></label>
    <button disabled={pending}>{pending ? 'Đang lưu...' : 'Lưu hồ sơ'}</button><Message state={state} />
  </form>;
}

export function AddressForm() {
  const [state, action, pending] = useActionState(addAddressAction, initial);
  return <form action={action} className="form accountForm">
    <h2>Thêm địa chỉ</h2>
    <label>Nhãn<input name="label" placeholder="Nhà, Văn phòng..." required maxLength={60} /></label>
    <label>Người nhận<input name="name" required minLength={2} maxLength={100} /></label>
    <label>Số điện thoại<input name="phone" required minLength={8} maxLength={20} /></label>
    <label>Địa chỉ<input name="address" required minLength={8} maxLength={300} /></label>
    <button disabled={pending}>{pending ? 'Đang lưu...' : 'Thêm địa chỉ'}</button><Message state={state} />
  </form>;
}
