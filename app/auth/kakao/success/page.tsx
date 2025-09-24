'use client';

import { useEffect } from 'react';

export default function KakaoAuthSuccessPage() {
  useEffect(() => {
    // 부모 창에 성공 메시지 전달
    if (window.opener) {
      window.opener.postMessage({
        type: 'KAKAO_LOGIN_SUCCESS'
      }, window.location.origin);
      window.close();
    } else {
      // 팝업이 아닌 경우 메인 페이지로 리다이렉트
      window.location.href = '/';
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h2>로그인 성공!</h2>
      <p>잠시 후 창이 닫힙니다...</p>
    </div>
  );
}
