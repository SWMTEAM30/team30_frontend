'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { useUser } from '@/queries/useUser';

// 이 컴포넌트는 UI를 렌더링하지 않고, 오직 상태 초기화 역할만 합니다.
export default function AuthJotaiInitializer() {
  const setUser = useSetAtom(userAtom);
  const { data: user, status } = useUser();

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setUser(user ?? null);
    }
  }, [user, status, setUser]);

  return null;
}
