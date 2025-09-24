'use client';

import { useEffect } from 'react';

export default function KakaoAuthErrorPage() {
  useEffect(() => {
    // URL 파라미터에서 에러 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error') || 'unknown_error';
    
    // 부모 창에 에러 메시지 전달
    if (window.opener) {
      window.opener.postMessage({
        type: 'KAKAO_LOGIN_ERROR',
        error: error
      }, window.location.origin);
      window.close();
    } else {
      // 팝업이 아닌 경우 로그인 페이지로 리다이렉트
      window.location.href = `/signin?error=${error}`;
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h2>로그인 실패</h2>
      <p>오류가 발생했습니다. 잠시 후 창이 닫힙니다...</p>
    </div>
  );
}
