'use client';

import { useActionState } from 'react';
import { createSnippetAction, deleteSnippetAction, updateSnippetAction } from '@/lib/marketing-actions';
import { marketingProviders } from '@/lib/marketing';
import type { MarketingActionState, MarketingSnippet } from '@/lib/marketing';

const initial: MarketingActionState = { status: 0, message: '' };

function Fields({ snippet }: { snippet?: MarketingSnippet }) {
  return <>
    <label>Tên<input name="name" defaultValue={snippet?.name} required maxLength={120} /></label>
    <label>Nhà cung cấp<select name="provider" defaultValue={snippet?.provider || 'custom'}>
      {marketingProviders.map(provider => <option key={provider} value={provider}>{provider}</option>)}
    </select></label>
    <label>Vị trí chạy<select name="placement" defaultValue={snippet?.placement || 'afterInteractive'}>
      <option value="beforeInteractive">beforeInteractive</option>
      <option value="afterInteractive">afterInteractive</option>
    </select></label>
    <label>JavaScript thuần<textarea name="scriptBody" defaultValue={snippet?.scriptBody} rows={8} required maxLength={30000} spellCheck={false} /></label>
    <label className="checkLabel"><input name="enabled" type="checkbox" defaultChecked={snippet?.enabled || false} /> Đang bật</label>
  </>;
}

function Message({ state }: { state: MarketingActionState }) {
  return state.message ? <p role="status" className={state.status >= 400 ? 'errorText' : 'success'}>{state.message}</p> : null;
}

export function CreateSnippetForm() {
  const [state, action, pending] = useActionState(createSnippetAction, initial);
  return <form action={action} className="form marketingForm">
    <h2>Thêm snippet</h2><Fields />
    <button disabled={pending}>{pending ? 'Đang lưu...' : 'Thêm snippet'}</button>
    <Message state={state} />
  </form>;
}

export function EditSnippetForm({ snippet }: { snippet: MarketingSnippet }) {
  const [state, action, pending] = useActionState(updateSnippetAction, initial);
  return <form action={action} className="form marketingForm">
    <input type="hidden" name="id" value={snippet.id} />
    <Fields snippet={snippet} />
    <button disabled={pending}>{pending ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
    <Message state={state} />
  </form>;
}

export function DeleteSnippetForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteSnippetAction, initial);
  return <form action={action} className="deleteForm">
    <input type="hidden" name="id" value={id} />
    <button className="linkBtn" disabled={pending}>{pending ? 'Đang xoá...' : 'Xoá'}</button>
    <Message state={state} />
  </form>;
}
