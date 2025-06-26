export const requestAPI = async (url: string, method: Method, body?: any): Promise<[APIResponseType<any>, any]> => {
  let [data, error]: [APIResponseType<any>, any] = [undefined, undefined];

  try {
    const option: RequestInit = {
      method: method,
      headers: {},
      credentials: 'include',
    };
    if (body) option['body'] = body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_TFT_BACKEND_URL}${url}`, option);
    data = await response.json();
  } catch (apiErr) {
    error = apiErr;
  }

  return [data, error];
};
