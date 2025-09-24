'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  useEffect(() => {
    // URL 파라미터에서 에러 정보 가져오기
    const errorMessage = message || 'unknown_error';
    
    // 부모 창에 에러 메시지 전달 (팝업인 경우)
    if (window.opener) {
      window.opener.postMessage({
        type: 'KAKAO_LOGIN_ERROR',
        error: 'auth_error',
        details: errorMessage
      }, window.location.origin);
      window.close();
    }
  }, [message]);

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h2>인증 오류</h2>
      <p>카카오 로그인 중 오류가 발생했습니다.</p>
      {message && (
        <details style={{ marginTop: '20px', textAlign: 'left' }}>
          <summary>오류 상세 정보</summary>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px',
            wordBreak: 'break-all'
          }}>
            {decodeURIComponent(message)}
          </pre>
        </details>
      )}
      <button 
        onClick={() => window.close()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        창 닫기
      </button>
    </div>
  );
}
