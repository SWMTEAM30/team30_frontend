import { useQuery } from '@tanstack/react-query';
import { getAuthCookie, getAuthJWT } from '@/lib/cookies';

export const tmpUserId = 'asdf';
export const tmpUsername = 'mindul';

// 실제 API 호출 함수
const getMe = async (): Promise<User | null> => {
  try {
    // 먼저 쿠키에서 사용자 정보 확인
    const cookieUser = getAuthCookie();
    if (cookieUser) {
      return cookieUser;
    }

    // JWT 토큰이 있는지 확인
    const jwtToken = getAuthJWT();
    if (!jwtToken) {
      return null; // 토큰이 없으면 로그인되지 않은 상태
    }

    // JWT 토큰으로 서버에 사용자 정보 요청
    const response = await fetch(`${process.env.NEXT_PUBLIC_TFT_BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const useUser = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false, // 쿠키 기반이므로 불필요
    retry: false, // 실패 시 재시도하지 않음
  });
};
