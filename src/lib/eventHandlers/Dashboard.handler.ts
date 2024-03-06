import { UrlPathsEnum } from '../enums/urlPaths.enum';
import { requestApi } from '../requests/default.request';

export class DashboardHandler {
  static async getDashboardMetrics() {
    const response = await requestApi(UrlPathsEnum.DASHBOARD_METRICS, 'get');
    return response as {
      streetCount: number;
      subscriberCount: number;
      properitesCount: number;
      totalBillings: number;
      totalPayments: number;
      billingAcrossMonths: { month: string; amount: string }[];
      paymentsAcrossMonths: { month: string; amount: string }[];
    };
  }
}
