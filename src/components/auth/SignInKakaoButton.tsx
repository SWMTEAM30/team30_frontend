'use client';

import { getKakaoAuthUrl, getKakaoConfig } from '@/lib/kakao-auth';

export default function SignInKakaoButton() {
  // 카카오 설정 확인
  const config = getKakaoConfig();
  const kakaoAuthUrl = getKakaoAuthUrl();
  
  // 환경변수가 없으면 에러 표시
  if (!config || !kakaoAuthUrl) {
    return (
      <div className="text-red-500 text-center p-2">
        카카오 로그인 설정 오류
      </div>
    );
  }
  
  console.log('Kakao Config:', config);
  console.log('Full Kakao Auth URL:', kakaoAuthUrl);
  
  return (
    <form action={kakaoAuthUrl} method="GET">
      <button type="submit">Sign In</button>
    </form>
  );
}
