import { atom } from 'jotai';
import { getAuthCookie } from '@/lib/cookies';

// // 초기값을 쿠키에서 가져오도록 설정
// export const userAtom = atom<User | null>(() => {
//   // SSR 환경에서는 null 반환
//   if (typeof window === 'undefined') return null;

//   // 클라이언트 환경에서는 쿠키에서 사용자 정보 가져오기
//   return getAuthCookie();
// });

export const userAtom = atom<User | null>(null);
