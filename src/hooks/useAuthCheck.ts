'use client';

import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { getAuthMe, postAuthRefresh } from '@/api/authAPI';
import { getAuthJWT } from '@/lib/cookies';
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
        // 1. 현재 user 상태가 있으면 그대로 반환
        if (user && user.userId && user.username) return { isAuthenticated: true, user };

        // 2. 브라우저 토큰에 access_token이 있는지 확인
        // 해당 로직은 지금 오류가 있어서 잠시 스킵

        // 3. 토큰이 있으면 authMe 호출해서 사용자 정보 갱신
        const response = await getAuthMe();
        if (response.status === 'success' && response.data) {
          // 4. 서버에서 사용자 정보를 성공적으로 가져왔으면 상태 업데이트
          setUser(response.data);
          return { isAuthenticated: true, user: response.data };
        } else {
          // 5. 서버에서 사용자 정보를 가져오지 못했으면 인증 실패
          console.log(response);
          throw new Error(response.message || 'Authentication failed');
        }
      } catch (error: any) {
        // 6.  refresh 시도
        try {
          console.log('Attempting token refresh...');
          const refreshResponse = await postAuthRefresh();
          if (refreshResponse.status === 'success') {
            // 7. refresh 성공 시 다시 authMe 호출
            const retryResponse = await getAuthMe();
            if (retryResponse.status === 'success' && retryResponse.data) {
              setUser(retryResponse.data);
              return { isAuthenticated: true, user: retryResponse.data };
            } else {
              throw new Error('Authentication failed');
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }

        // 8. 모든 시도가 실패한 경우 인증 실패 처리
        setUser(null);
        if (alertMessage) alert(alertMessage);
        if (redirectToSignin) router.push('/signin');
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

  return {
    user,
    isAuthenticated: isAuthenticated(),
    isChecking,
    checkAuth,
  };
}
