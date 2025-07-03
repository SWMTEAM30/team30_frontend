type AnswerType = {
  question: string;
  answer: string;
};

type QuestionAPIType = {
  question: string;
  options: Array<string>;
};

// 성공 시의 반환 타입
type APISuccessResponse<T> = {
  ok: true;
  data: {
    status: string;
    message: string;
    data: T;
  };
  error?: never;
};

// 실패 시의 반환 타입
type APIErrorResponse = {
  ok: false;
  data?: never;
  error: any;
};

// 최종 반환 타입 (성공 또는 실패)
type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
