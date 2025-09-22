// 쿠키 관리 유틸리티 함수들
import { getUserFromJWT, isValidJWT, getJWTExpirationTime } from './jwt';

export interface CookieOptions {
  expires?: Date;
  maxAge?: number; // 초 단위
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * 쿠키 설정
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  if (typeof window === 'undefined') return; // SSR 환경에서는 실행하지 않음

  const { expires, maxAge, path = '/', domain, secure = false, httpOnly = false, sameSite = 'lax' } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += `; secure`;
  }

  if (httpOnly) {
    cookieString += `; httpOnly`;
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * 쿠키 가져오기
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null; // SSR 환경에서는 null 반환

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * 쿠키 삭제
 */
export const deleteCookie = (name: string, path: string = '/', domain?: string) => {
  if (typeof window === 'undefined') return; // SSR 환경에서는 실행하지 않음

  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
};

/**
 * 모든 쿠키 가져오기
 */
export const getAllCookies = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}; // SSR 환경에서는 빈 객체 반환

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(';');

  for (let cookie of cookieArray) {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
};

// 인증 관련 쿠키 상수
export const AUTH_COOKIE_NAME = 'tft_auth_jwt';
export const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7일 (초 단위)

/**
 * JWT 토큰을 쿠키에 저장
 */
export const setAuthCookie = (jwtToken: string) => {
  if (!jwtToken || !isValidJWT(jwtToken)) {
    console.error('Invalid JWT token provided');
    return;
  }

  // JWT의 만료 시간을 기준으로 쿠키 만료 시간 설정
  const expirationTime = getJWTExpirationTime(jwtToken);
  const maxAge = expirationTime ? Math.floor((expirationTime - Date.now()) / 1000) : AUTH_COOKIE_MAX_AGE;

  setCookie(AUTH_COOKIE_NAME, jwtToken, {
    maxAge: Math.max(maxAge, 0), // 음수가 되지 않도록 보장
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

/**
 * 쿠키에서 JWT 토큰을 가져와서 사용자 정보 추출
 */
export const getAuthCookie = (): User | null => {
  const jwtToken = getCookie(AUTH_COOKIE_NAME);
  if (!jwtToken) return null;

  // JWT 유효성 검사
  if (!isValidJWT(jwtToken)) {
    console.error('Invalid or expired JWT token in cookie');
    deleteAuthCookie(); // 유효하지 않은 토큰 삭제
    return null;
  }

  // JWT에서 사용자 정보 추출
  const user = getUserFromJWT(jwtToken);
  if (!user) {
    console.error('Failed to extract user info from JWT');
    deleteAuthCookie(); // 사용자 정보 추출 실패 시 쿠키 삭제
    return null;
  }

  return user;
};

/**
 * 쿠키에서 JWT 토큰 자체를 가져오기 (API 요청용)
 */
export const getAuthJWT = (): string | null => {
  const jwtToken = getCookie(AUTH_COOKIE_NAME);
  if (!jwtToken || !isValidJWT(jwtToken)) {
    return null;
  }
  return jwtToken;
};

/**
 * 인증 쿠키 삭제
 */
export const deleteAuthCookie = () => {
  deleteCookie(AUTH_COOKIE_NAME);
};
