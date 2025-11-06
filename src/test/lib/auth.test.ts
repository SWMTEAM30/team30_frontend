import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  decodeJWT,
  getUserFromJWT,
  getJWTExpirationTime,
  isValidJWT,
  setAuthCookie,
  getAuthCookie,
  getAuthJWT,
  deleteAuthCookie,
} from '@/lib/auth';

// cookies 모듈 모킹
vi.mock('@/lib/cookies', () => ({
  setCookie: vi.fn(),
  getCookie: vi.fn(),
  deleteCookie: vi.fn(),
}));

// cookies.config 모킹
vi.mock('@/config/cookies.config', () => ({
  AUTH_COOKIE_NAME: 'access_token',
  AUTH_COOKIE_MAX_AGE: 604800,
}));

describe('auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('decodeJWT', () => {
    it('should decode valid JWT token', () => {
      const payload = { sub: 'user123', nickname: 'testuser', exp: Math.floor(Date.now() / 1000) + 3600 };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      const result = decodeJWT(token);
      expect(result).toEqual(payload);
    });

    it('should return null for invalid JWT format', () => {
      expect(decodeJWT('invalid')).toBeNull();
      expect(decodeJWT('header.payload')).toBeNull();
    });

    it('should handle base64 padding correctly', () => {
      const payload = { test: 'data' };
      const base64 = btoa(JSON.stringify(payload));
      const token = `header.${base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      const result = decodeJWT(token);
      expect(result).toEqual(payload);
    });
  });

  describe('getUserFromJWT', () => {
    it('should extract user info from JWT with sub field', async () => {
      const payload = { sub: 'user123', nickname: 'testuser' };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      const user = await getUserFromJWT(token);
      expect(user?.userId).toBe('user123');
      expect(user?.username).toBe('testuser');
    });

    it('should extract user info with userId field', async () => {
      const payload = { userId: 'user456', username: 'another' };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      const user = await getUserFromJWT(token);
      expect(user?.userId).toBe('user456');
      expect(user?.username).toBe('another');
    });

    it('should return null for invalid token', async () => {
      const user = await getUserFromJWT('invalid-token');
      expect(user).toBeNull();
    });

    it('should return null when user data is missing', async () => {
      const payload = { someField: 'value' };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      const user = await getUserFromJWT(token);
      expect(user).toBeNull();
    });
  });

  describe('getJWTExpirationTime', () => {
    it('should return expiration time in milliseconds', () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      const result = getJWTExpirationTime(token);
      expect(result).toBe(exp * 1000);
    });

    it('should return null when exp is missing', () => {
      const payload = { sub: 'user123' };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      const result = getJWTExpirationTime(token);
      expect(result).toBeNull();
    });
  });

  describe('isValidJWT', () => {
    it('should return true for valid JWT with user data', async () => {
      const payload = { sub: 'user123', nickname: 'testuser' };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      const result = await isValidJWT(token);
      expect(result).toBe(true);
    });

    it('should return false for invalid JWT', async () => {
      const result = await isValidJWT('invalid-token');
      expect(result).toBe(false);
    });
  });

  describe('setAuthCookie', () => {
    it('should set cookie with valid JWT', async () => {
      const { setCookie } = await import('@/lib/cookies');
      const payload = { sub: 'user123', nickname: 'testuser', exp: Math.floor(Date.now() / 1000) + 3600 };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      await setAuthCookie(token);
      expect(setCookie).toHaveBeenCalled();
    });

    it('should not set cookie with invalid JWT', async () => {
      const { setCookie } = await import('@/lib/cookies');
      await setAuthCookie('invalid-token');
      expect(setCookie).not.toHaveBeenCalled();
    });
  });

  describe('getAuthCookie', () => {
    it('should return user from valid cookie', async () => {
      const { getCookie } = await import('@/lib/cookies');
      const payload = { sub: 'user123', nickname: 'testuser' };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      vi.mocked(getCookie).mockResolvedValue(token);
      
      const user = await getAuthCookie();
      expect(user?.userId).toBe('user123');
    });

    it('should return null when cookie is missing', async () => {
      const { getCookie } = await import('@/lib/cookies');
      vi.mocked(getCookie).mockResolvedValue(null);
      
      const user = await getAuthCookie();
      expect(user).toBeNull();
    });
  });

  describe('getAuthJWT', () => {
    it('should return JWT token from cookie', async () => {
      const { getCookie } = await import('@/lib/cookies');
      const payload = { sub: 'user123', nickname: 'testuser' };
      const token = `header.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.signature`;
      
      vi.mocked(getCookie).mockResolvedValue(token);
      
      const result = await getAuthJWT();
      expect(result).toBe(token);
    });

    it('should return null for invalid token', async () => {
      const { getCookie } = await import('@/lib/cookies');
      vi.mocked(getCookie).mockResolvedValue('invalid-token');
      
      const result = await getAuthJWT();
      expect(result).toBeNull();
    });
  });

  describe('deleteAuthCookie', () => {
    it('should delete auth cookie', async () => {
      const { deleteCookie } = await import('@/lib/cookies');
      await deleteAuthCookie();
      expect(deleteCookie).toHaveBeenCalledWith('access_token');
    });
  });
});

