// 카카오 인증 관련 유틸리티 함수들

export interface KakaoAuthConfig {
  clientId: string;
  redirectUrl: string;
}

/**
 * 카카오 OAuth URL 생성
 */
export const generateKakaoAuthUrl = (config: KakaoAuthConfig): string => {
  const { clientId, redirectUrl } = config;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: 'code'
  });
  
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
};

/**
 * 환경변수에서 카카오 설정 가져오기
 */
export const getKakaoConfig = (): KakaoAuthConfig | null => {
  const clientId = process.env.NEXT_PUBLIC_AUTH_KAKAO_ID;
  const redirectUrl = process.env.NEXT_PUBLIC_AUTH_KAKAO_REDIRECT_URL;
  
  if (!clientId || !redirectUrl) {
    console.error('Missing Kakao environment variables:', {
      clientId: !!clientId,
      redirectUrl: !!redirectUrl,
      clientIdValue: clientId,
      redirectUrlValue: redirectUrl
    });
    return null;
  }
  
  return { clientId, redirectUrl };
};

/**
 * 카카오 인증 URL 생성 (환경변수 기반)
 */
export const getKakaoAuthUrl = (): string | null => {
  const config = getKakaoConfig();
  if (!config) return null;
  
  return generateKakaoAuthUrl(config);
};
