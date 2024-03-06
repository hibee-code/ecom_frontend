import { EventBus, Notify } from 'quasar';
import { LGAModel } from '../../models/lga.model';
import { EventNamesEnum } from '../enums/events.enum';
import {
  requestPostLga,
  requestGetLGAs,
  requestPostLgaWard,
  requestGetLgaWards,
  requestPostStreet,
  requestGetStreets,
} from '../requests/streetLgaWard.request';
import { LGAWardModel } from 'src/models/lgaWard.model';
import { StreetModel } from 'src/models/Street.model';
import useLgaWardStreetStore from 'src/stores/lga-ward-street';

export class LgaWardStreetHandler {
  static async handlePostLga(
    eventBus: EventBus,
    {
      onSuccess,
      onError,
    }: { onSuccess?: () => void; onError?: (error: unknown) => void } = {}
  ) {
    eventBus.on(EventNamesEnum.POST_LGA, async (lga: LGAModel) => {
      try {
        await requestPostLga(lga);

        // callback
        onSuccess && onSuccess();

        // notify user
        Notify.create({
          message: 'Process was successful',
          color: 'positive',
        });
      } catch (error) {
        // callback
        onError && onError(error);

        // notify user
        Notify.create({
          message: 'Post LGA failed',
          color: 'negative',
          icon: 'warning',
          timeout: 5000,
        });
      }
    });
  }

  static async getLgas(query: { name?: string } = {}) {
    try {
      return await requestGetLGAs(query);
    } catch (error) {
      Notify.create({
        message: 'Failed to fetch L.G.A.',
        color: 'negative',
        icon: 'warning',
        timeout: 5000,
      });
    }
  }

  static async handlePostLgaWard(
    eventBus: EventBus,
    {
      onSuccess,
      onError,
    }: { onSuccess?: () => void; onError?: (error: unknown) => void } = {}
  ) {
    eventBus.on(EventNamesEnum.POST_LGA_WARD, async (lgaWard: LGAWardModel) => {
      try {
        await requestPostLgaWard(lgaWard);

        // callback
        onSuccess && onSuccess();

        // notify user
        Notify.create({
          message: 'Process was successful',
          color: 'positive',
          textColor: 'white',
          position: 'top',
        });
      } catch (error) {
        // callback
        onError && onError(error);

        // notify user
        Notify.create({
          message: 'Post LGA failed',
          color: 'negative',
          icon: 'warning',
          timeout: 5000,
        });
        // console.log(error);
      }
    });
  }

  static getLgaWards(query: { name?: string; lgaId?: string } = {}) {
    try {
      return requestGetLgaWards(query);
    } catch (error) {
      Notify.create({
        message: 'Failed to fetch L.G.A.',
        color: 'negative',
        icon: 'warning',
        timeout: 5000,
      });
    }
  }

  static handlePostStreet(
    eventBus: EventBus,
    {
      onSuccess,
      onError,
    }: { onSuccess?: () => void; onError?: (error: unknown) => void } = {}
  ) {
    eventBus.on(EventNamesEnum.POST_STREET, async (street: StreetModel) => {
      try {
        await requestPostStreet(street);
        await useLgaWardStreetStore().fetchServerData({ type: 'street' });

        // callback
        onSuccess && onSuccess();

        // notify user
        Notify.create({
          message: 'Process was successful',
          color: 'positive',
          textColor: 'white',
          position: 'top',
        });
      } catch (error) {
        // callback
        onError && onError(error);

        // notify user
        Notify.create({
          message: 'Post LGA failed',
          color: 'negative',
          textColor: 'white',
          position: 'top',
        });
        // console.log(error);
      }
    });
  }

  static getStreets(query: { name?: string } = {}) {
    try {
      return requestGetStreets(query);
    } catch (error) {
      Notify.create({
        message: 'Failed to fetch L.G.A.',
        color: 'negative',
        textColor: 'white',
        position: 'top',
        icon: 'warning',
        timeout: 5000,
      });
    }
  }
}
