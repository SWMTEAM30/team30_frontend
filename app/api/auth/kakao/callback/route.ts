import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // 에러가 있는 경우
  if (error) {
    console.error('Kakao OAuth error:', error);
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>카카오 로그인</title>
        </head>
        <body>
          <script>
            // 부모 창에 에러 메시지 전달
            if (window.opener) {
              window.opener.postMessage({
                type: 'KAKAO_LOGIN_ERROR',
                error: '${error}'
              }, window.location.origin);
              window.close();
            } else {
              // 팝업이 아닌 경우 리다이렉트
              window.location.href = '/signin?error=kakao_auth_failed';
            }
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }

  // 인증 코드가 없는 경우
  if (!code) {
    console.error('No authorization code received');
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>카카오 로그인</title>
        </head>
        <body>
          <script>
            // 부모 창에 에러 메시지 전달
            if (window.opener) {
              window.opener.postMessage({
                type: 'KAKAO_LOGIN_ERROR',
                error: 'no_code'
              }, window.location.origin);
              window.close();
            } else {
              // 팝업이 아닌 경우 리다이렉트
              window.location.href = '/signin?error=no_code';
            }
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
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
    
    // 성공 시 부모 창에 메시지 전달하고 팝업 닫기
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>카카오 로그인</title>
        </head>
        <body>
          <script>
            // 부모 창에 성공 메시지 전달
            if (window.opener) {
              window.opener.postMessage({
                type: 'KAKAO_LOGIN_SUCCESS',
                data: ${JSON.stringify(data)}
              }, window.location.origin);
              window.close();
            } else {
              // 팝업이 아닌 경우 메인 페이지로 리다이렉트
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error) {
    console.error('Kakao callback error:', error);
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>카카오 로그인</title>
        </head>
        <body>
          <script>
            // 부모 창에 에러 메시지 전달
            if (window.opener) {
              window.opener.postMessage({
                type: 'KAKAO_LOGIN_ERROR',
                error: 'callback_failed'
              }, window.location.origin);
              window.close();
            } else {
              // 팝업이 아닌 경우 리다이렉트
              window.location.href = '/signin?error=callback_failed';
            }
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}
