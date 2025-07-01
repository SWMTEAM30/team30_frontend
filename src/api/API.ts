export const requestAPI = async <T>(url: string, method: Method, body?: any): Promise<APIResponse<T>> => {
  try {
    const option: RequestInit = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    if (body) option['body'] = JSON.stringify(body);

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
