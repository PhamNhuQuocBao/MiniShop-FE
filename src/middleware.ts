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
  const withRegion = (response: NextResponse) => {
    if (request.cookies.get('region')?.value !== region) response.cookies.set('region', region, { maxAge: 60 * 60 * 24 * 30, sameSite: 'lax', path: '/' });
    return response;
  };
  if (!request.nextUrl.pathname.startsWith('/dashboard') && !request.nextUrl.pathname.startsWith('/api/admin/demo')) return withRegion(NextResponse.next());
  const isApi = request.nextUrl.pathname.startsWith('/api/admin/demo');
  const token = request.cookies.get('minishop_session')?.value;

  if (!token) return withRegion(deny(request, isApi, 401));

  try {
    const baseUrl = (process.env.API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) return withRegion(deny(request, isApi, 401));

    const data = (await response.json()) as { user?: DemoUser };
    if (data.user?.role !== 'ADMIN') return withRegion(deny(request, isApi, 403));
    return withRegion(NextResponse.next());
  } catch {
    return withRegion(isApi
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
  const destination = status === 401 ? '/login?next=%2Fdashboard' : '/account?forbidden=1';
  return NextResponse.redirect(new URL(destination, request.url));
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|.*\\..*).*)', '/api/admin/demo/:path*'],
};
