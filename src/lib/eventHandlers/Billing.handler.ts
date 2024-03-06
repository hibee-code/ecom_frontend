import { EventBus, Notify } from 'quasar';
import { EventNamesEnum } from '../enums/events.enum';
import { BillingModel } from 'src/models/GenerateBill.model';
import {
  requestGetBilling,
  requestPostBilling,
} from '../requests/billing.request';
import { requestApi } from '../requests/default.request';
import { UrlPathsEnum } from '../enums/urlPaths.enum';

export class BillingHandler {
  static async handGenerateBilling(
    eventSource: EventBus,
    {
      onSuccess,
      onError,
    }: { onSuccess?: () => void; onError?: (error?: unknown) => void } = {}
  ) {
    eventSource.on(
      EventNamesEnum.GENERATE_BILLING,
      async (billingModel: BillingModel) => {
        try {
          await requestPostBilling(billingModel);

          onSuccess?.();

          Notify.create({
            message: 'Process was successful',
            color: 'positive',
          });
        } catch (error) {
          onError?.();

          Notify.create({
            message: (error as Error).message,
            color: 'negative',
            icon: 'warning',
            timeout: 5000,
          });
        }
      }
    );
  }

  static async getBilling(query: {
    month: string;
    year: string;
    propertySubscriptionId: string;
    streetId: string;
  }) {
    try {
      return await requestGetBilling(query);
    } catch (error) {
      Notify.create({
        message: (error as Error).message,
        color: 'negative',
        icon: 'warning',
        timeout: 5000,
      });
    }
  }

}
