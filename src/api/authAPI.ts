import { requestAPI } from '@/api/API';

/// GET

export const getAuthMe = async () => requestAPI<any>(`/api/auth/me`, 'GET');

export const getAuthKakaoCallback = async (): Promise<APIResponse<User>> => {
  const response = await requestAPI<APIUser>(`/api/auth/kakao/callback`, 'GET');
  if (response.status == 'fail') return response;
  return {
    status: response.status,
    message: response.message,
    data: {
      userId: response.data.userId,
      username: response.data.nickname,
    },
  };
};

/// POST
export const postAuthRefresh = async () => requestAPI<any>(`/api/auth/refresh`, 'POST');

export const postAuthLogout = async () => requestAPI<any>(`/api/auth/logout`, 'POST');
