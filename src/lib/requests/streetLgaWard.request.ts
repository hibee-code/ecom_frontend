import { api } from 'src/boot/axios';
import { UrlPathsEnum } from '../enums/urlPaths.enum';
import { LGAModel } from '../../models/lga.model';
import { LGAWardModel } from 'src/models/lgaWard.model';
import { StreetModel } from 'src/models/Street.model';

export async function requestPostLga(lga: LGAModel) {
  const serverResponse = await api.post(UrlPathsEnum.LGA, lga);
  if (serverResponse.status === 201) {
    const responseBody = serverResponse.data as LGAModel;
    return responseBody;
  } else {
    throw new Error('Post LGA failed', {
      cause: serverResponse.data,
    });
  }
}

export async function requestPostLgaWard(lgaWard: LGAWardModel) {
  const serverResponse = await api.post(UrlPathsEnum.LGA_WARD, lgaWard);
  if (serverResponse.status === 201) {
    const responseBody = serverResponse.data as LGAWardModel;
    return responseBody;
  } else {
    throw new Error('Post LGA Ward failed', {
      cause: serverResponse.data,
    });
  }
}

export async function requestPostStreet(streetModel: StreetModel) {
  const serverResponse = await api.post(UrlPathsEnum.STREET, streetModel);
  if (serverResponse.status === 201) {
    const responseBody = serverResponse.data as StreetModel;
    return responseBody;
  } else {
    throw new Error('Post Street failed', {
      cause: serverResponse.data,
    });
  }
}

export async function requestGetLGAs({ name }: { name?: string } = {}) {
  const response = await api.get(UrlPathsEnum.LGA, { params: { name } });
  return response.data;
}

export async function requestGetLgaWards({
  name,
  lgaId,
}: { name?: string; lgaId?: string } = {}) {
  const response = await api.get(UrlPathsEnum.LGA_WARD, {
    params: { name, lgaId },
  });
  return response.data;
}

export async function requestGetStreets({
  name,
  lgaWardId,
}: { name?: string; lgaWardId?: string } = {}) {
  const response = await api.get(UrlPathsEnum.STREET, {
    params: { name, lgaWardId },
  });
  return response.data;
}
