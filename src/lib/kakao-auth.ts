interface KakaoAuthConfig {
  clientId: string;
  redirectUrl: string;
}

const getKakaoConfig = (): KakaoAuthConfig | null => {
  const clientId = process.env.NEXT_PUBLIC_AUTH_KAKAO_ID;
  const redirectUrl = process.env.NEXT_PUBLIC_AUTH_KAKAO_REDIRECT_URL;

  if (!clientId || !redirectUrl) {
    console.error('Missing Kakao environment variables:', {
      clientId: !!clientId,
      redirectUrl: !!redirectUrl,
      clientIdValue: clientId,
      redirectUrlValue: redirectUrl,
    });
    return null;
  }

  return { clientId, redirectUrl };
};

export const getKakaoAuthUrl = (): string | null => {
  const config = getKakaoConfig();
  if (!config) return null;
  const { clientId, redirectUrl } = config;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: 'code',
  });

  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
};
