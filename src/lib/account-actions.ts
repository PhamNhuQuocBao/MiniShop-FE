'use server';

import { revalidatePath } from 'next/cache';
import { currentUser } from './auth';
import { accountApi } from './account-api';

export type AccountActionState = { status: number; message: string };
const forbidden: AccountActionState = { status: 401, message: 'Vui lòng đăng nhập lại' };
const failure = (error: unknown): AccountActionState => ({ status: 400, message: error instanceof Error ? error.message : 'Không lưu được thông tin' });

export async function updateProfileAction(_previous: AccountActionState, form: FormData): Promise<AccountActionState> {
  if (!await currentUser()) return forbidden;
  try {
    await accountApi('/api/account/profile', { method: 'PATCH', body: JSON.stringify({
      name: String(form.get('name') || ''), email: String(form.get('email') || ''), phone: String(form.get('phone') || ''),
    }) });
    revalidatePath('/account', 'layout');
    return { status: 200, message: 'Đã lưu hồ sơ' };
  } catch (error) { return failure(error); }
}

export async function addAddressAction(_previous: AccountActionState, form: FormData): Promise<AccountActionState> {
  if (!await currentUser()) return forbidden;
  try {
    await accountApi('/api/account/addresses', { method: 'POST', body: JSON.stringify({
      label: String(form.get('label') || ''), name: String(form.get('name') || ''),
      phone: String(form.get('phone') || ''), address: String(form.get('address') || ''),
    }) });
    revalidatePath('/account/addresses');
    return { status: 200, message: 'Đã thêm địa chỉ' };
  } catch (error) { return failure(error); }
}
