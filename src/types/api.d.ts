// 성공 시의 반환 타입
type APISuccessResponse<T> = {
  status: 'success';
  message: string;
  data: T;
};

// 실패 시의 반환 타입
type APIErrorResponse = {
  status: 'fail';
  message: string;
  data: null;
};

// 최종 반환 타입 (성공 또는 실패)
type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
