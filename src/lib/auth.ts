import { setCookie, getCookie, deleteCookie } from '@/lib/cookies';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '@/config/cookies.config';

// ===== JWT 유틸 함수들 =====

export const decodeJWT = (token: string): any | null => {
  try {
    // JWT는 header.payload.signature 형태
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // decoding
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const getUserFromJWT = async (token: string): Promise<User | null> => {
  const payload = decodeJWT(token);
  if (!payload) return null;

  // JWT 페이로드에서 사용자 정보 추출
  // 카카오 로그인의 경우 sub, nickname 등의 필드 사용
  const userId = payload.sub || payload.userId || payload.id;
  const username = payload.nickname || payload.username || payload.name || 'mindul';

  if (!userId || !username) {
    console.error('Invalid user data in JWT payload:', payload);
    return null;
  }

  return {
    userId: userId.toString(),
    username: username.toString(),
    modelImage: null,
  };
};

export const getJWTExpirationTime = (token: string): number | null => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return null;

  return payload.exp * 1000;
};

export const isValidJWT = async (token: string): Promise<boolean> => {
  const expirationTime = getJWTExpirationTime(token);
  const currentTime = Math.floor(Date.now());
  //if (!expirationTime || expirationTime < currentTime) return false;

  const user = await getUserFromJWT(token);
  return user !== null;
};

// ===== Auth Cookie 유틸 함수들 =====

export const setAuthCookie = async (jwtToken: string) => {
  if (!(await isValidJWT(jwtToken))) {
    console.error('Invalid JWT token provided');
    return;
  }

  const expirationTime = getJWTExpirationTime(jwtToken);
  const maxAge = expirationTime ? Math.floor((expirationTime - Date.now()) / 1000) : AUTH_COOKIE_MAX_AGE;

  await setCookie(AUTH_COOKIE_NAME, jwtToken, {
    maxAge: Math.max(maxAge, 0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true, // 보안을 위해 HttpOnly 설정
  });
};

export const getAuthCookie = async (): Promise<User | null> => {
  const jwtToken = await getCookie(AUTH_COOKIE_NAME);
  if (!jwtToken) return null;

  if (!(await isValidJWT(jwtToken))) {
    console.error('Invalid or expired JWT token in cookie');
    await deleteAuthCookie();
    return null;
  }

  const user = await getUserFromJWT(jwtToken);
  if (!user) {
    console.error('Failed to extract user info from JWT');
    await deleteAuthCookie();
    return null;
  }

  return user;
};

export const getAuthJWT = async (): Promise<string | null> => {
  const jwtToken = await getCookie(AUTH_COOKIE_NAME);
  if (!jwtToken || !(await isValidJWT(jwtToken))) return null;
  return jwtToken;
};

export const deleteAuthCookie = async () => {
  await deleteCookie(AUTH_COOKIE_NAME);
};
