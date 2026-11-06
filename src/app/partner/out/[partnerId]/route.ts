import { NextRequest, NextResponse } from 'next/server';

type Partner = { id: string; name: string; trackingUrl: string; enabled: boolean };

export async function GET(request: NextRequest, { params }: { params: Promise<{ partnerId: string }> }) {
  const { partnerId } = await params;
  const base = (process.env.API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');
  try {
    const response = await fetch(`${base}/api/partners/${encodeURIComponent(partnerId)}`, { cache: 'no-store' });
    if (!response.ok) return new Response(response.status === 400 ? 'ID đối tác không hợp lệ' : response.status === 404 ? 'Không tìm thấy đối tác' : 'Không đọc được đối tác', { status: response.status === 400 ? 400 : response.status === 404 ? 404 : 502 });
    const { partner } = await response.json() as { partner: Partner };
    const override = request.nextUrl.searchParams.get('dest');
    const destination = override === null ? partner.trackingUrl : override;
    let url: URL;
    try { url = new URL(destination); }
    catch { return new Response('Đường dẫn không hợp lệ', { status: 400 }); }
    if (!['http:', 'https:'].includes(url.protocol)) return new Response('Đường dẫn không hợp lệ', { status: 400 });
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'minishop');
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'partner');
    if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', request.cookies.get('region')?.value || 'us');
    return NextResponse.redirect(url);
  } catch { return new Response('Không mở được liên kết đối tác', { status: 502 }); }
}
