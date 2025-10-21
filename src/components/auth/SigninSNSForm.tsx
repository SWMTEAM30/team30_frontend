import { getKakaoAuthUrl } from '@/lib/kakao-auth';
import Link from 'next/link';

export default function SigninSNSForm() {
  const kakaoAuthUrl = getKakaoAuthUrl();

  if (!kakaoAuthUrl) {
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
      <Link
        href={kakaoAuthUrl}
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
      </Link>

      {/* 네이버 로그인 버튼 */}
      <button
        className="
          group relative w-full
          flex items-center justify-center 
          px-6 py-4 
          bg-gradient-to-r from-[#03C75A] to-[#00B04F]
          hover:from-[#00B04F] hover:to-[#009944]
          rounded-2xl 
          transition-all duration-300 ease-out
          transform hover:scale-105 hover:-translate-y-1
          shadow-lg hover:shadow-xl
          border border-green-300/50
          overflow-hidden
        "
      >
        {/* 배경 애니메이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        <div className="relative z-10 flex items-center space-x-3">
          {/* 네이버 아이콘 */}
          <div className="flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"
                fill="white"
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </svg>
          </div>

          {/* 텍스트 */}
          <span className="text-white font-semibold text-lg">네이버로 시작하기</span>
        </div>
      </button>

      {/* 구글 로그인 버튼 */}
      <button
        className="
          group relative w-full
          flex items-center justify-center 
          px-6 py-4 
          bg-white
          hover:bg-gray-50
          rounded-2xl 
          transition-all duration-300 ease-out
          transform hover:scale-105 hover:-translate-y-1
          shadow-lg hover:shadow-xl
          border border-gray-200
          overflow-hidden
        "
      >
        {/* 배경 애니메이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100/0 via-gray-100/20 to-gray-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        <div className="relative z-10 flex items-center space-x-3">
          {/* 구글 아이콘 */}
          <div className="flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </svg>
          </div>

          {/* 텍스트 */}
          <span className="text-gray-700 font-semibold text-lg">구글로 시작하기</span>
        </div>
      </button>
    </div>
  );
}
