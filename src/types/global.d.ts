declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_TFT_BASE_URL: string;
      NEXT_PUBLIC_TFT_BACKEND_URL: string;
      NEXT_PUBLIC_AUTH_KAKAO_ID: string;
      NEXT_PUBLIC_AUTH_KAKAO_REDIRECT_URL: string;
      AUTH_KAKAO_SECRET: string;
      AUTH_KAKAO_BACKEND_URL: string;
      GEMINI_API_KEY: string;
    }
  }
  interface Navigator {
    connection?: {
      effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
      downlink?: number;
      rtt?: number;
    };
  }
  // interface Window {
  //   kakao: any;
  // }
}

export {};
