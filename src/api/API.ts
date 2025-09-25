export const requestAPI = async <T>(url: string, method: Method, body?: any, header?: any): Promise<APIResponse<T>> => {
  try {
    const option: RequestInit = {
      method: method,
      credentials: 'include',
    };
    if (body) {
      if (body instanceof FormData) option['body'] = body;
      else option['body'] = JSON.stringify(body);
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_TFT_BACKEND_URL}${url}`, option);
    return await response.json();
  } catch (apiErr) {
    return {
      status: 'fail',
      data: null,
      message: 'API Error',
    };
  }
};
