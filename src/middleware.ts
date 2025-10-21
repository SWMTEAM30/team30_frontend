import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthCookie } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증이 필요한 경로들
  const protectedPaths = ['/dashboard', '/profile', '/settings'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // 인증이 필요하지 않은 경로는 그대로 통과
  if (!isProtectedPath) return NextResponse.next();

  try {
    // 서버에서 쿠키를 통해 인증 상태 확인
    const user = await getAuthCookie();

    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!user) {
      const loginUrl = new URL('/signin', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 인증된 사용자의 경우 요청 헤더에 사용자 정보 추가
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-username', user.username);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // 에러 발생 시 로그인 페이지로 리다이렉트
    console.error('Middleware auth check failed:', error);
    const loginUrl = new URL('/signin', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
