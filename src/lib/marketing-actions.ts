'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { api } from './api';
import { currentUser } from './auth';
import type { MarketingActionState, MarketingSnippet } from './marketing';

const forbidden: MarketingActionState = { status: 403, message: 'Không có quyền quản lý snippet' };

async function adminToken() {
  const user = await currentUser();
  if (user?.role !== 'ADMIN') return null;
  return (await cookies()).get('minishop_session')?.value || null;
}

function inputFrom(form: FormData) {
  return {
    name: String(form.get('name') || ''),
    provider: String(form.get('provider') || ''),
    scriptBody: String(form.get('scriptBody') || ''),
    placement: String(form.get('placement') || ''),
    enabled: form.get('enabled') === 'on',
  };
}

function failure(error: unknown): MarketingActionState {
  return { status: 400, message: error instanceof Error ? error.message : 'Không lưu được snippet' };
}

export async function createSnippetAction(_previous: MarketingActionState, form: FormData): Promise<MarketingActionState> {
  const token = await adminToken();
  if (!token) return forbidden;
  try {
    await api('/api/marketing/snippets', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(inputFrom(form)) });
    revalidatePath('/', 'layout');
    return { status: 200, message: 'Đã thêm snippet' };
  } catch (error) { return failure(error); }
}

export async function updateSnippetAction(_previous: MarketingActionState, form: FormData): Promise<MarketingActionState> {
  const token = await adminToken();
  if (!token) return forbidden;
  try {
    const id = String(form.get('id') || '');
    await api(`/api/marketing/snippets/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(inputFrom(form)) });
    revalidatePath('/', 'layout');
    return { status: 200, message: 'Đã cập nhật snippet' };
  } catch (error) { return failure(error); }
}

export async function deleteSnippetAction(_previous: MarketingActionState, form: FormData): Promise<MarketingActionState> {
  const token = await adminToken();
  if (!token) return forbidden;
  try {
    const id = String(form.get('id') || '');
    await api(`/api/marketing/snippets/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    revalidatePath('/', 'layout');
    return { status: 200, message: 'Đã xoá snippet' };
  } catch (error) { return failure(error); }
}

export async function previewSnippetAction(form: FormData) {
  const token = await adminToken();
  if (!token) redirect('/login');
  const id = String(form.get('id') || '');
  await api<{ snippet: MarketingSnippet }>(`/api/marketing/snippets/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}` } });
  (await cookies()).set('preview_snippet', id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 3600 });
  redirect('/');
}

export async function exitPreviewAction() {
  (await cookies()).delete('preview_snippet');
  redirect('/admin/marketing');
}
