import { cookies } from 'next/headers';

export interface CookieOptions {
  expires?: Date;
  maxAge?: number; // 초 단위
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const CookieErrorString = '서버에서만 가능합니다. API 라우트나 서버 컴포넌트에서 사용하세요.';

export const setCookie = async (name: string, value: string, options: CookieOptions = {}) => {
  if (typeof window !== 'undefined') throw new Error(CookieErrorString);

  const cookieStore = await cookies();
  cookieStore.set(name, value, options);
};

export const getCookie = async (name: string): Promise<string | null> => {
  if (typeof window !== 'undefined') throw new Error(CookieErrorString);

  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value || null;
};

export const deleteCookie = async (name: string) => {
  if (typeof window !== 'undefined') throw new Error(CookieErrorString);

  const cookieStore = await cookies();
  cookieStore.delete(name);
};
