'use client';

import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { deleteAuthCookie } from '@/lib/cookies';

export default function SignOutButton() {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);
  
  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청
      const res = await fetch(`${process.env.NEXT_PUBLIC_TFT_BASE_URL}/api/auth/logout/kakao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      // 로컬 상태 및 쿠키 정리
      setUser(null);
      deleteAuthCookie();
      
      if (res.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 발생해도 로컬 상태는 정리
      setUser(null);
      deleteAuthCookie();
      router.push('/');
    }
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}
