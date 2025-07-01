export const requestAPI = async <T>(url: string, method: Method, body?: any): Promise<APIResponse<T>> => {
  try {
    const option: RequestInit = {
      method: method,
      headers: {},
      credentials: 'include',
    };
    if (body) option['body'] = body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_TFT_BACKEND_URL}${url}`, option);
    return {
      ok: true,
      data: await response.json(),
      error: undefined,
    };
  } catch (apiErr) {
    return {
      ok: false,
      data: undefined,
      error: apiErr,
    };
  }
};
