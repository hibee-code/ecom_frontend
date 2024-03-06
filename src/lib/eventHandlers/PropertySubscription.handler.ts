import { EventBus, Notify } from 'quasar';
import { EventNamesEnum } from '../enums/events.enum';
import { PropertySubscriptionModel } from '../../models/PropertySubscription.model';
import {
  requestGetPhoneCodes,
  requestGetPropertyTypes,
  requestGetSubscriberUser,
  requestGetSubscription,
  requestPostPropertyType,
  requestPostSubscriber,
  requestPostSubscription,
} from '../requests/propertySubscription.request';
import { PropertyTypeModel } from 'src/models/PropertyType.model';
import { SubscriberModel } from 'src/models/Subscriber.model';
import { PropertySubscription } from '../types/types';

export class PropertySubscriptionHandler {
  static async handlePostSubscription(
    eventSource: EventBus,
    {
      onSuccess,
      onError,
    }: { onSuccess?: () => void; onError?: (error?: unknown) => void } = {}
  ) {
    eventSource.on(
      EventNamesEnum.NEW_PROPERTY_SUBSCRIPTION,
      async (newPropertySubscription: PropertySubscriptionModel) => {
        try {
          newPropertySubscription.propertyUnit = Number(
            newPropertySubscription.propertyUnit
          );
          await requestPostSubscription(newPropertySubscription);

          onSuccess?.();

          Notify.create({
            message: 'New property subscription created.',
            color: 'positive',
            icon: 'check',
            timeout: 5000,
          });
        } catch (error) {
          onError?.();
          Notify.create({
            message: 'Failed to create new property subscription.',
            color: 'negative',
            icon: 'warning',
            timeout: 5000,
          });
        }
      }
    );
  }

  static async getSubscriptions(
    query: { limit?: string; page?: string; streetId?: string } = {}
  ) {
    try {
      let limit: number | undefined;
      let page: number | undefined;
      if (query) {
        limit = query.limit ? Number(query.limit) : undefined;
        page = query.limit ? Number(query.page) : undefined;
      }
      const subscriptions = (await requestGetSubscription({
        limit,
        page,
        streetId: query.streetId,
      })) as PropertySubscription[];
      return subscriptions;
    } catch (error) {
      //
      Notify.create({
        message: 'Failed to fetch subscriptions',
      });
    }
  }

  static async getSubscriberUsers(query: { query?: string } = {}) {
    try {
      return await requestGetSubscriberUser(query);
    } catch (error) {
      Notify.create({
        message: 'Failed to fetch subscriber users.',
        color: 'negative',
        icon: 'warning',
        timeout: 5000,
      });
    }
  }

  static async handlePostPropertyType(
    eventSource: EventBus,
    {
      onSuccess,
      onError,
    }: { onSuccess?: () => void; onError?: (error: unknown) => void } = {}
  ) {
    //
    eventSource.on(
      EventNamesEnum.POST_PROPERTY_TYPE,
      async (newPropertyType: PropertyTypeModel) => {
        try {
          await requestPostPropertyType(newPropertyType);

          // handle success
          onSuccess?.();

          // notify user
          Notify.create({
            message: 'Process was successful',
            color: 'positive',
          });
        } catch (error) {
          // handle failure
          onError?.(error);

          // notify user
          Notify.create({
            message: 'Post Property Type failed',
            color: 'negative',
            icon: 'warning',
            timeout: 5000,
          });
        }
      }
    );
  }

  static async handlePostSubscriberUser(
    eventSource: EventBus,
    {
      onSuccess,
      onError,
    }: { onSuccess?: () => void; onError?: (error: unknown) => void } = {}
  ) {
    eventSource.on(
      EventNamesEnum.POST_SUBSCRIBER,
      async (newSubscriber: SubscriberModel) => {
        //
        try {
          newSubscriber.password = 'default-password';
          await requestPostSubscriber(newSubscriber);

          // handle success
          onSuccess?.();

          // notify user
          Notify.create({
            message: 'Process was successful',
            color: 'positive',
          });
        } catch (error) {
          // handle failure
          onError?.(error);
          // notify user
          Notify.create({
            message: 'Post Subscriber failed',
            color: 'negative',
            icon: 'warning',
            timeout: 5000,
          });
        }
      }
    );
  }

  static async getPropertyTypes(
    query: { name?: string; unitPrice?: number } = {}
  ) {
    try {
      const propertyTypes = await requestGetPropertyTypes(query);
      return propertyTypes;
    } catch (error) {
      // Notify
      Notify.create({
        message: 'Failed to fetch property types',
        color: 'negative',
        icon: 'warning',
        timeout: 5000,
      });
    }
  }

  static async getPhoneCodes(query: { query?: string; id?: string } = {}) {
    try {
      const phoneCode = await requestGetPhoneCodes(query);
      return phoneCode;
    } catch (error) {
      Notify.create({
        message: 'Failed to fetch phone codes',
        color: 'negative',
        icon: 'warning',
        timeout: 500,
      });
    }
  }
}
