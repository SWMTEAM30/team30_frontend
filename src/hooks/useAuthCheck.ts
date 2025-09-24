'use client';

import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { getAuthMe } from '@/api/authAPI';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface AuthCheckOptions {
  redirectToSignin?: boolean;
  showAlert?: boolean;
  alertMessage?: string;
}

export function useAuthCheck() {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  const checkAuth = useCallback(
    async (options: AuthCheckOptions = {}) => {
      const { redirectToSignin = true, showAlert = true, alertMessage = '로그인이 필요합니다.' } = options;

      setIsChecking(true);

      try {
        // 1. 현재 user 상태가 있으면 그대로 반환
        if (user && user.userId && user.username) {
          return { isAuthenticated: true, user };
        }

        // 2. user 상태가 없으면 /api/auth/me 호출
        console.log('User state is null, fetching from server...');
        const response = await getAuthMe();

        if (response.status === 'success' && response.data) {
          // 3. 서버에서 사용자 정보를 성공적으로 가져왔으면 상태 업데이트
          setUser(response.data);
          return { isAuthenticated: true, user: response.data };
        } else {
          // 4. 서버에서 사용자 정보를 가져오지 못했으면 인증 실패
          throw new Error(response.message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Auth check failed:', error);

        // 5. 인증 실패 처리
        setUser(null);

        if (showAlert) {
          alert(alertMessage);
        }

        if (redirectToSignin) {
          router.push('/signin');
        }

        return { isAuthenticated: false, user: null, error };
      } finally {
        setIsChecking(false);
      }
    },
    [user, setUser, router],
  );

  // 간단한 인증 확인 (리다이렉트 없이)
  const isAuthenticated = useCallback(() => {
    return !!(user && user.userId && user.username);
  }, [user]);

  // 강제로 사용자 정보 갱신
  const refreshUser = useCallback(async () => {
    setIsChecking(true);

    try {
      const response = await getAuthMe();

      if (response.status === 'success' && response.data) {
        setUser(response.data);
        return { success: true, user: response.data };
      } else {
        setUser(null);
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      return { success: false, error };
    } finally {
      setIsChecking(false);
    }
  }, [setUser]);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    isChecking,
    checkAuth,
    refreshUser,
  };
}
