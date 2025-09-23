// 인증 관련 헬퍼 함수들
import { getAuthJWT } from './cookies';

/**
 * 인증이 필요한 API 요청을 위한 헤더 생성
 */
export const getAuthHeaders = (): Record<string, string> => {
  const jwtToken = getAuthJWT();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  return headers;
};

/**
 * 인증이 필요한 fetch 요청을 위한 옵션 생성
 */
export const getAuthFetchOptions = (method: string = 'GET', body?: any): RequestInit => {
  return {
    method,
    credentials: 'include',
    headers: getAuthHeaders(),
    ...(body && { body: JSON.stringify(body) }),
  };
};

/**
 * 인증된 사용자가 있는지 확인
 */
export const isAuthenticated = (): boolean => {
  return getAuthJWT() !== null;
};

