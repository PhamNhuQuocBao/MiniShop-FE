import { NextRequest, NextResponse } from 'next/server';

type DemoUser = { role: 'CUSTOMER' | 'ADMIN' };

export async function middleware(request: NextRequest) {
  const pathRegion = request.nextUrl.pathname.split('/')[1];
  let hostRegion: string | undefined;
  if (process.env.REGION_HOSTS) {
    try { hostRegion = JSON.parse(process.env.REGION_HOSTS)[request.nextUrl.hostname]; }
    catch { /* next.config.mjs validates REGION_HOSTS at build */ }
  }
  const savedRegion = request.cookies.get('region')?.value;
  const region = ['us', 'eu', 'vn'].includes(pathRegion) ? pathRegion : ['us', 'eu', 'vn'].includes(hostRegion || '') ? hostRegion! : ['us', 'eu', 'vn'].includes(savedRegion || '') ? savedRegion! : 'us';
  const savedVariant = request.cookies.get('ab_variant')?.value;
  const variant = savedVariant === 'A' || savedVariant === 'B' || savedVariant === 'C' ? savedVariant : (['A', 'B', 'C'] as const)[Math.floor(Math.random() * 3)];
  const savedDevice = request.cookies.get('device')?.value;
  const device = savedDevice === 'mobile' || savedDevice === 'desktop' ? savedDevice : /Mobi|Android|iPhone|iPad/i.test(request.headers.get('user-agent') || '') ? 'mobile' : 'desktop';
  // Pass newly assigned cookies upstream so the first page render matches the response cookies.
  request.cookies.set('region', region);
  request.cookies.set('ab_variant', variant);
  request.cookies.set('device', device);
  const next = () => NextResponse.next({ request: { headers: new Headers(request.headers) } });
  const withVisitorCookies = (response: NextResponse) => {
    const options = { maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' as const, path: '/' };
    if (savedRegion !== region) response.cookies.set('region', region, options);
    if (savedVariant !== variant) response.cookies.set('ab_variant', variant, options);
    if (savedDevice !== device) response.cookies.set('device', device, options);
    return response;
  };
  const isAdminPage = process.env.LOCAL_CVE_MODE === '1' && (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/'));
  if (!isAdminPage && !request.nextUrl.pathname.startsWith('/dashboard') && !request.nextUrl.pathname.startsWith('/api/admin/demo')) return withVisitorCookies(next());
  const isApi = request.nextUrl.pathname.startsWith('/api/admin/demo');
  const token = request.cookies.get('minishop_session')?.value;

  if (!token) return withVisitorCookies(deny(request, isApi, 401));

  try {
    const baseUrl = (process.env.API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) return withVisitorCookies(deny(request, isApi, 401));

    const data = (await response.json()) as { user?: DemoUser };
    if (data.user?.role !== 'ADMIN') return withVisitorCookies(deny(request, isApi, 403));
    return withVisitorCookies(next());
  } catch {
    return withVisitorCookies(isApi
      ? NextResponse.json({ error: { code: 'AUTH_UNAVAILABLE', message: 'Không kiểm tra được phiên' } }, { status: 503 })
      : new NextResponse('Không kiểm tra được phiên. Vui lòng thử lại sau.', { status: 503 }));
  }
}

function deny(request: NextRequest, isApi: boolean, status: 401 | 403) {
  if (isApi) {
    return NextResponse.json(
      { error: { code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN', message: status === 401 ? 'Vui lòng đăng nhập' : 'Không có quyền truy cập' } },
      { status },
    );
  }
  const nextPath = request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/') ? request.nextUrl.pathname : '/dashboard';
  const destination = status === 401 ? `/login?next=${encodeURIComponent(nextPath)}` : '/account?forbidden=1';
  return NextResponse.redirect(new URL(destination, request.url));
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|.*\\..*).*)', '/api/admin/demo/:path*'],
};
