import { api } from 'src/boot/axios';
import { UrlPathsEnum } from '../enums/urlPaths.enum';
import SigninModel from '../../models/Signin.model';
export async function requestSignin(signinModel: SigninModel) {
  const serverResponse = await api.post(UrlPathsEnum.SIGNIN, signinModel, {
    headers: {
      Authorization: undefined,
    },
  });
  if ([200, 201].includes(serverResponse.status)) {
    const responseBody = serverResponse.data as { token: string };
    return responseBody.token;
  } else {
    throw new Error('Signin failed', {
      cause: serverResponse.data,
    });
  }
}
