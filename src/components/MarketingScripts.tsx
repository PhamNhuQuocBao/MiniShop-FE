import Script from 'next/script';
import { cookies } from 'next/headers';
import { api } from '@/lib/api';
import { currentUser } from '@/lib/auth';
import { exitPreviewAction } from '@/lib/marketing-actions';
import type { MarketingSnippet } from '@/lib/marketing';

export async function MarketingScripts() {
  const previewId = (await cookies()).get('preview_snippet')?.value;
  let snippets: MarketingSnippet[] = [];
  let preview: MarketingSnippet | null = null;

  if (previewId) {
    const user = await currentUser();
    const token = (await cookies()).get('minishop_session')?.value;
    if (user?.role === 'admin' && token) {
      try {
        preview = (await api<{ snippet: MarketingSnippet }>(`/api/marketing/snippets/${encodeURIComponent(previewId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })).snippet;
        snippets = [preview];
      } catch { /* A removed snippet ends the preview on the next request. */ }
    }
  }

  if (!preview) {
    try {
      snippets = (await api<{ snippets: MarketingSnippet[] }>('/api/marketing/snippets/enabled')).snippets;
    } catch { /* Storefront stays available if marketing data is unavailable. */ }
  }

  return <>
    {preview && <div className="previewBanner" role="status">
      Preview snippet: {preview.name}
      <form action={exitPreviewAction}><button type="submit">Thoát preview</button></form>
    </div>}
    {snippets.map(snippet => <Script
      key={snippet.id}
      id={snippet.id}
      strategy={snippet.placement}
      dangerouslySetInnerHTML={{ __html: snippet.scriptBody }}
    />)}
  </>;
}
