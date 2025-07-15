export const requestAPI = async <T>(
  url: string,
  method: Method,
  body?: any,
  header = { 'Content-Type': 'application/json' } as any,
): Promise<APIResponse<T>> => {
  try {
    const option: RequestInit = {
      method: method,
      headers: header,
      credentials: 'include',
    };
    if (body) {
      if (body instanceof FormData) option['body'] = body;
      else option['body'] = JSON.stringify(body);
    }
    const response = await fetch(`${url}`, option);
    return {
      ok: true,
      ...(await response.json()),
    };
  } catch (apiErr) {
    return {
      ok: false,
      error: apiErr,
    };
  }
};
