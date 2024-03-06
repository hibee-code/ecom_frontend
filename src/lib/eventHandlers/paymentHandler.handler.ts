import { EventBus } from 'quasar';
import { useNotify } from 'src/composables/useNotify';
import { requestApi } from '../requests/default.request';
import { UrlPathsEnum } from '../enums/urlPaths.enum';
import { EventNamesEnum } from '../enums/events.enum';

export class PaymentHandler {
  static async handlePostPayment(
    eventSource: EventBus,
    {
      onSuccess,
      onError,
    }: { onSuccess?: () => void; onError?: (error?: unknown) => void } = {}
  ) {
    eventSource.on(
      EventNamesEnum.POST_PAYMENT,
      async (paymentModel: Record<string, unknown>) => {
        //
        try {
          await requestApi(UrlPathsEnum.PAYMENT, 'post', {
            body: paymentModel,
          });

          // handle success
          onSuccess?.();
          useNotify({ type: 'positive' });
        } catch (error) {
          onError?.(error);
          useNotify({ type: 'negative' });
        }
      }
    );
  }

  static getPayments(query: Record<string, unknown>) {
    return requestApi(UrlPathsEnum.PAYMENT, 'get', { params: query });
  }
}
