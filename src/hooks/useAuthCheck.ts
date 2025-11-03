'use client';

import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { getAuthMe, postAuthRefresh } from '@/api/authAPI';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface AuthCheckOptions {
  redirectToSignin?: boolean;
  alertMessage?: string;
}

export function useAuthCheck() {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  const checkAuth = useCallback(
    async (options: AuthCheckOptions = {}) => {
      const { redirectToSignin = true, alertMessage = '로그인이 필요합니다.' } = options;
      setIsChecking(true);

      try {
        const response = await getAuthMe();

        if (response.status === 'success' && response.data) {
          setUser(response.data);
          return { isAuthenticated: true, user: response.data };
        } else throw new Error(response.message || 'Authentication failed');
      } catch (error: any) {
        try {
          const refreshResponse = await postAuthRefresh();
          console.log(refreshResponse);
          if (refreshResponse.status === 'success') {
            const retryResponse = await getAuthMe();
            if (retryResponse.status === 'success' && retryResponse.data) {
              setUser(retryResponse.data);
              return { isAuthenticated: true, user: retryResponse.data };
            } else throw new Error('Authentication failed after refresh');
          } else throw new Error('Token refresh failed');
        } catch (refreshError) {
          console.error('🔹 토큰 갱신 실패:', refreshError);
        }
        setUser(null);
        if (alertMessage) alert(alertMessage);
        if (redirectToSignin) router.push('/signin');
        return { isAuthenticated: false, user: null, error };
      } finally {
        setIsChecking(false);
      }
    },
    [setUser, router],
  );

  // 서버 API 호출을 통한 인증 확인 (Jotai 상태 무시)
  const isAuthenticated = useCallback(async () => {
    try {
      const response = await getAuthMe();
      if (response.status === 'success' && response.data) {
        // 서버에서 성공적으로 사용자 정보를 가져왔으면 Jotai 상태도 업데이트
        setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.log('🔹 isAuthenticated 체크 실패:', error);
      return false;
    }
  }, [setUser]);

  return {
    user,
    isAuthenticated: isAuthenticated,
    isChecking,
    checkAuth,
  };
}
