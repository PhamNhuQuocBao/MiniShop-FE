import { cookies } from 'next/headers';
import { api } from './api';

export async function accountApi<T>(path: string, init?: RequestInit): Promise<T> {
  const token = (await cookies()).get('minishop_session')?.value;
  return api<T>(path, { ...init, headers: { Authorization: `Bearer ${token || ''}`, ...init?.headers } });
}
