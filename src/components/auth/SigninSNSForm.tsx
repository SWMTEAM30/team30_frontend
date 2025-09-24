'use client';

import { getKakaoAuthUrl, getKakaoConfig } from '@/lib/kakao-auth';

export default function SigninSNSForm() {
  const config = getKakaoConfig();
  const kakaoAuthUrl = getKakaoAuthUrl();

  // 카카오 로그인 - 전체 페이지 리다이렉트
  const handleKakaoLogin = () => {
    if (!kakaoAuthUrl) return;

    // 현재 창에서 카카오 인증 페이지로 이동
    window.location.href = kakaoAuthUrl;
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

  return (
    <div className="space-y-4">
      {/* 카카오 로그인 버튼 */}
      <button
        onClick={handleKakaoLogin}
        className="
          group relative w-full
          flex items-center justify-center 
          px-6 py-4 
          bg-gradient-to-r from-[#FEE500] to-[#FDD835]
          hover:from-[#FDD835] hover:to-[#FBC02D]
          rounded-2xl 
          transition-all duration-300 ease-out
          transform hover:scale-105 hover:-translate-y-1
          shadow-lg hover:shadow-xl
          border border-yellow-300/50
          overflow-hidden
        "
      >
        {/* 배경 애니메이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        <div className="relative z-10 flex items-center space-x-3">
          {/* 카카오 아이콘 */}
          <div className="flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 3.125C5.5375 3.125 2 5.73125 2 8.9375C2 11.0937 3.4 13.0062 5.5 14.0812C5.3 14.6375 4.775 16.3625 4.725 16.5937C4.65 16.9062 4.9125 16.9062 5.0625 16.8125C5.1875 16.7312 7.25 15.4 8.025 14.9C8.675 15.0125 9.3375 15.0687 10 15.0687C14.4625 15.0687 18 12.4625 18 9.25625C18 6.05 14.4625 3.125 10 3.125Z"
                fill="#391B1B"
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </svg>
          </div>

          {/* 텍스트 */}
          <span className="text-[#391B1B] font-semibold text-lg">카카오로 시작하기</span>
        </div>
      </button>
    </div>
  );
}
