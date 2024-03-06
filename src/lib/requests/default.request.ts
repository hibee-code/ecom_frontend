import { api } from 'src/boot/axios';
import { UrlPathsEnum } from '../enums/urlPaths.enum';

export async function requestApi(
  url: UrlPathsEnum | string,
  method: 'get' | 'post' = 'get',
  payload: {
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
  } = {}
) {
  const serverResponse = await api[method](
    url,
    payload?.body ? payload.body : { params: payload?.params }
  );
  const status = serverResponse.status;
  const methodStatusIsValid =
    (method === 'get' && status === 200) ||
    (method === 'post' && status === 201);

  if (!methodStatusIsValid) {
    throw new Error('Request failed', {
      cause: serverResponse.data,
    });
  }

  const responseBody = serverResponse.data;
  return responseBody;
}
