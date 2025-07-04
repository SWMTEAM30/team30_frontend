export const requestAPI = async <T>(url: string, method: Method, body?: any): Promise<APIResponse<T>> => {
  try {
    const option: RequestInit = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    if (body) option['body'] = JSON.stringify(body);
    console.log(option);
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
