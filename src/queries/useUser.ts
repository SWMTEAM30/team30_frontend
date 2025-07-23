import { useQuery } from '@tanstack/react-query';

export const tmpUserId = 'asdf';
export const tmpUsername = 'mindul';

const getMe = (): User => ({ userId: 'asdf', username: 'mindul' }); // 임시로 사용자 로그인 키 (asdf) 발급해주는 함수

export const useUser = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 300 * 1000,
    refetchOnWindowFocus: true,
  });
};
