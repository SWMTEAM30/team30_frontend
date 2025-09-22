'use client';

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { useUser } from '@/queries/useUser';
import { getAuthCookie, setAuthCookie, deleteAuthCookie } from '@/lib/cookies';

// 이 컴포넌트는 UI를 렌더링하지 않고, 오직 상태 초기화 역할만 합니다.
export default function AuthJotaiInitializer() {
  const setUser = useSetAtom(userAtom);
  const { data: user, status } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  // 컴포넌트 마운트 시 쿠키에서 사용자 정보 복원
  useEffect(() => {
    const cookieUser = getAuthCookie();
    if (cookieUser) {
      setUser(cookieUser);
    }
    setIsInitialized(true);
  }, [setUser]);

  // API에서 사용자 정보를 가져왔을 때 처리
  useEffect(() => {
    if (!isInitialized) return;

    if (status === 'success' && user) {
      // API에서 사용자 정보를 성공적으로 가져왔을 때
      // JWT 토큰은 서버에서 쿠키로 설정되므로 여기서는 상태만 업데이트
      setUser(user);
    } else if (status === 'error') {
      // API 호출 실패 시 쿠키에서 사용자 정보 삭제
      deleteAuthCookie();
      setUser(null);
    }
  }, [user, status, setUser, isInitialized]);

  return null;
}
