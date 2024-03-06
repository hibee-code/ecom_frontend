import { api } from 'src/boot/axios';
import { BillingModel } from 'src/models/GenerateBill.model';
import { UrlPathsEnum } from '../enums/urlPaths.enum';

export async function requestPostBilling(billingModel: BillingModel) {
  const serverResponse = await api.post(UrlPathsEnum.BILLING, billingModel);

  if (serverResponse.status === 201) {
    return serverResponse.data;
  } else {
    throw new Error('Attempt to generate billing failed', {
      cause: serverResponse.data,
    });
  }
}

/**
 * Makes an HTTP GET request to the `/utils-billing/billing` endpoint using the `axios` library.
 *
 * @param query - An object containing query parameters to be sent with the GET request.
 * @returns A promise that resolves to the response data if the request is successful, otherwise throws an error.
 *
 * @example
 * const query = {
 *   param1: 'value1',
 *   param2: 'value2',
 * };
 *
 * try {
 *   const billings = await getBilling(query);
 *   console.log(billings);
 * } catch (error) {
 *   console.error(error);
 * }
 */
export async function requestGetBilling(query: Record<string, unknown>) {
  const serverResponse = await api.get(UrlPathsEnum.BILLING, {
    params: query,
  });

  if (serverResponse.status === 200) {
    return serverResponse.data;
  } else {
    throw new Error('Could not fetch billings');
  }
}
