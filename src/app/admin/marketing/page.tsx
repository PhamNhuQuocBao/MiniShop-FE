import Link from 'next/link';
import { Fragment } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/lib/api';
import { currentUser } from '@/lib/auth';
import { previewSnippetAction } from '@/lib/marketing-actions';
import type { MarketingSnippet } from '@/lib/marketing';
import { CreateSnippetForm, DeleteSnippetForm, EditSnippetForm } from '@/components/MarketingForms';

export const dynamic = 'force-dynamic';

export default async function MarketingPage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/');

  let snippets: MarketingSnippet[] = [];
  let loadError = '';
  try {
    const token = (await cookies()).get('minishop_session')?.value;
    snippets = (await api<{ snippets: MarketingSnippet[] }>('/api/marketing/snippets', {
      headers: { Authorization: `Bearer ${token}` },
    })).snippets;
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Không tải được snippet';
  }

  return <div className="wrap page marketingPage">
    <Link href="/admin" className="breadcrumbs">← Quản trị</Link>
    <span className="eyebrow">MARKETING</span>
    <h1>Marketing Script Manager</h1>
    <p className="lead">Quản lý JavaScript tracking. Paste phần bên trong thẻ script, không paste cả thẻ HTML.</p>
    <CreateSnippetForm />
    <h2>Danh sách snippet</h2>
    {loadError ? <p className="notice error">{loadError}</p> : snippets.length === 0 ? <p className="notice">Chưa có snippet nào.</p> :
      <div className="marketingTableWrap"><table className="marketingTable"><thead><tr>
        <th>Tên</th><th>Provider</th><th>Vị trí</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th>
      </tr></thead><tbody>{snippets.map(snippet => <Fragment key={snippet.id}><tr>
        <td><strong>{snippet.name}</strong><small>{snippet.id}</small></td>
        <td>{snippet.provider}</td><td>{snippet.placement}</td>
        <td>{snippet.enabled ? 'Đang bật' : 'Đang tắt'}</td>
        <td>{new Date(snippet.createdAt).toLocaleDateString('vi-VN')}</td>
        <td><div className="marketingActions">
          <form action={previewSnippetAction}><input type="hidden" name="id" value={snippet.id} /><button type="submit" className="smallButton">Preview</button></form>
          <DeleteSnippetForm id={snippet.id} />
        </div></td>
      </tr><tr><td colSpan={6}>
        <details><summary>Sửa {snippet.name}</summary><EditSnippetForm snippet={snippet} /></details>
      </td></tr></Fragment>)}</tbody></table></div>}
  </div>;
}
