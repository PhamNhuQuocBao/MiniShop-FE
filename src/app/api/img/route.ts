import { NextRequest } from 'next/server';

const placeholder = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="#edf3f5"/><text x="320" y="245" fill="#42616d" text-anchor="middle" font-family="sans-serif" font-size="30">MiniShop</text></svg>';
const fallback = () => new Response(placeholder, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get('src');
  if (!src) return fallback();
  try {
    const url = new URL(src);
    if (!['http:', 'https:'].includes(url.protocol)) return fallback();
    const upstream = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const contentType = upstream.headers.get('content-type') || '';
    if (!upstream.ok || !upstream.body || !contentType.toLowerCase().startsWith('image/')) return fallback();
    return new Response(upstream.body, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600' } });
  } catch { return fallback(); }
}
