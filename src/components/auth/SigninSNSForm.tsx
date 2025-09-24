'use client';

import { getKakaoAuthUrl, getKakaoConfig } from '@/lib/kakao-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SigninSNSForm() {
  const router = useRouter();
  const config = getKakaoConfig();
  const kakaoAuthUrl = getKakaoAuthUrl();

  // 팝업 창에서 메시지 수신 처리
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message from popup:', event.data);
      console.log('Message origin:', event.origin);
      console.log('Current origin:', window.location.origin);

      // 보안을 위해 origin 화이트리스트로 확인 (로컬/프로덕션 모두 허용)
      const allowedOrigins = new Set([
        window.location.origin,
        'http://localhost:3000',
        'http://localhost:3001',
        'https://the-first-take.com',
      ]);
      if (!allowedOrigins.has(event.origin)) {
        console.warn('Message origin not allowed, ignoring');
        return;
      }
      
      if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {
        console.log('Kakao login success, reloading page');
        // 로그인 성공 시 페이지 새로고침 또는 리다이렉트
        window.location.reload();
      } else if (event.data.type === 'KAKAO_LOGIN_ERROR') {
        console.error('Kakao login error:', event.data.error);
        console.error('Error details:', event.data.details);
        alert(`카카오 로그인에 실패했습니다: ${event.data.error}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 카카오 로그인 팝업 열기
  const handleKakaoLogin = () => {
    if (!kakaoAuthUrl) return;

    const popup = window.open(
      kakaoAuthUrl,
      'kakaoLogin',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // 팝업이 차단되었는지 확인
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }

    // 팝업에서 URL 변경 감지
    const checkUrl = setInterval(() => {
      try {
        const popupUrl = popup.location.href;
        
        // 성공 페이지로 리다이렉트된 경우
        if (popupUrl.includes('/auth/kakao/success')) {
          clearInterval(checkUrl);
          popup.close();
          window.location.reload();
        }
        
        // 에러 페이지로 리다이렉트된 경우
        if (popupUrl.includes('/auth/kakao/error') || popupUrl.includes('/auth/error')) {
          clearInterval(checkUrl);
          popup.close();
          alert('카카오 로그인에 실패했습니다.');
        }
        
        // 메인 페이지로 리다이렉트된 경우 (백엔드에서 직접 처리)
        if (popupUrl.includes(window.location.origin) && !popupUrl.includes('/auth/kakao/')) {
          clearInterval(checkUrl);
          popup.close();
          window.location.reload();
        }
      } catch (e) {
        // Cross-origin 에러는 무시 (카카오 도메인에서 발생)
      }
    }, 1000);

    // 5분 후 자동으로 체크 중단
    setTimeout(() => {
      clearInterval(checkUrl);
    }, 300000);
  };

  // 환경변수가 없으면 에러 표시
  if (!config || !kakaoAuthUrl) {
    return (
      <div className="text-red-500 text-center p-4">
        카카오 로그인 설정이 완료되지 않았습니다.
        <br />
        <small className="text-xs">
          NEXT_PUBLIC_AUTH_KAKAO_ID와 NEXT_PUBLIC_AUTH_KAKAO_REDIRECT_URL을 확인해주세요.
        </small>
      </div>
    );
  }

  console.log('Kakao Config:', config);
  console.log('Full Kakao Auth URL:', kakaoAuthUrl);

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* <button className="flex justify-center items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">
        <Image
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
          alt="Google"
          className="w-6 h-6"
          width={300}
          height={300}
        />
      </button>

      <button className="flex justify-center items-center p-3 rounded-xl bg-[#03C75A] hover:bg-[#02b350] transition-all duration-200 shadow-sm hover:shadow-md">
        <span className="text-white font-bold text-lg w-6 h-6 flex items-center justify-center">N</span>
      </button> */}

      <button 
        onClick={handleKakaoLogin}
        className="w-full flex justify-center items-center p-3 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 3.125C5.5375 3.125 2 5.73125 2 8.9375C2 11.0937 3.4 13.0062 5.5 14.0812C5.3 14.6375 4.775 16.3625 4.725 16.5937C4.65 16.9062 4.9125 16.9062 5.0625 16.8125C5.1875 16.7312 7.25 15.4 8.025 14.9C8.675 15.0125 9.3375 15.0687 10 15.0687C14.4625 15.0687 18 12.4625 18 9.25625C18 6.05 14.4625 3.125 10 3.125Z"
            fill="#391B1B"
          />
        </svg>
      </button>
    </div>
  );
}
