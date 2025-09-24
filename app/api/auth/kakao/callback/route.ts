import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // 에러가 있는 경우
  if (error) {
    console.error('Kakao OAuth error:', error);
    return NextResponse.redirect(new URL('/signin?error=kakao_auth_failed', request.url));
  }

  // 인증 코드가 없는 경우
  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(new URL('/signin?error=no_code', request.url));
  }

  try {
    // 백엔드 API로 인증 코드 전송
    const backendUrl = process.env.NEXT_PUBLIC_TFT_BACKEND_URL;
    const response = await fetch(`${backendUrl}/api/auth/kakao/callback?code=${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    // 성공 시 메인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/', request.url));
    
  } catch (error) {
    console.error('Kakao callback error:', error);
    return NextResponse.redirect(new URL('/signin?error=callback_failed', request.url));
  }
}
