import { NextRequest, NextResponse } from 'next/server';

type DemoUser = { role: 'customer' | 'admin' };

export async function middleware(request: NextRequest) {
  const isApi = request.nextUrl.pathname.startsWith('/api/admin/demo');
  const token = request.cookies.get('minishop_session')?.value;

  if (!token) return deny(request, isApi, 401);

  try {
    const baseUrl = (process.env.API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) return deny(request, isApi, 401);

    const data = (await response.json()) as { user?: DemoUser };
    if (data.user?.role !== 'admin') return deny(request, isApi, 403);
    return NextResponse.next();
  } catch {
    return isApi
      ? NextResponse.json({ error: { code: 'AUTH_UNAVAILABLE', message: 'Không kiểm tra được phiên' } }, { status: 503 })
      : new NextResponse('Không kiểm tra được phiên. Vui lòng thử lại sau.', { status: 503 });
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
  matcher: ['/dashboard/:path*', '/api/admin/demo/:path*'],
};
