// JWT 토큰 관리 유틸리티 함수들

/**
 * JWT 토큰을 디코딩하여 페이로드 추출
 * 클라이언트 사이드에서만 사용 (서명 검증 없음)
 */
export const decodeJWT = (token: string): any | null => {
  try {
    // JWT는 header.payload.signature 형태
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // payload 부분 디코딩 (base64url)
    const payload = parts[1];
    
    // base64url 디코딩
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * JWT 토큰이 만료되었는지 확인
 */
export const isJWTExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true; // 만료 정보가 없으면 만료된 것으로 간주
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * JWT 토큰에서 사용자 정보 추출
 */
export const getUserFromJWT = (token: string): User | null => {
  const payload = decodeJWT(token);
  if (!payload) return null;

  // JWT 페이로드에서 사용자 정보 추출
  // 카카오 로그인의 경우 일반적으로 sub, nickname 등의 필드 사용
  const userId = payload.sub || payload.userId || payload.id;
  const username = payload.nickname || payload.username || payload.name;

  if (!userId || !username) {
    console.error('Invalid user data in JWT payload:', payload);
    return null;
  }

  return {
    userId: userId.toString(),
    username: username.toString()
  };
};

/**
 * JWT 토큰 유효성 검사
 */
export const isValidJWT = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // 만료 확인
  if (isJWTExpired(token)) {
    return false;
  }

  // 사용자 정보 추출 가능한지 확인
  const user = getUserFromJWT(token);
  return user !== null;
};

/**
 * JWT 토큰에서 만료 시간 추출 (밀리초)
 */
export const getJWTExpirationTime = (token: string): number | null => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }

  return payload.exp * 1000; // 초를 밀리초로 변환
};

/**
 * JWT 토큰에서 발급 시간 추출 (밀리초)
 */
export const getJWTIssuedTime = (token: string): number | null => {
  const payload = decodeJWT(token);
  if (!payload || !payload.iat) {
    return null;
  }

  return payload.iat * 1000; // 초를 밀리초로 변환
};

