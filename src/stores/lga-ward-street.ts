import { defineStore } from 'pinia';
import { forageGetItem, forageSetItem } from 'src/boot/storeforage';
import { StreetModel } from 'src/models/Street.model';
import { StorageNamesEnum } from '.';
import { LgaWardStreetHandler } from 'src/lib/eventHandlers/LgaWardStreet.handler';

export type LgaWardStreetStore = {
  streets?: StreetModel[];
};

const lgaWardStreet =
  ((await forageGetItem<LgaWardStreetStore>(
    StorageNamesEnum.LGA_WARD_STREET
  )) as LgaWardStreetStore) || {};
console.log('This is lga ward street store ', lgaWardStreet);

const useLgaWardStreetStore = defineStore('lgaWardStreet', {
  state: (): { streets?: StreetModel[] } => {
    return {
      streets: lgaWardStreet.streets,
    };
  },
  getters: {
    //
  },
  actions: {
    async fetchServerData({ type }: { type: 'lga' | 'ward' | 'street' }) {
      //
      const actionHandlers: { [handlerType: string]: () => Promise<void> } = {
        street: async () => {
          const streets =
            (await LgaWardStreetHandler.getStreets()) as StreetModel[];
          this.streets = streets;
        },
      };
      const handler = actionHandlers[type];
      handler?.();
    },
  },
});

useLgaWardStreetStore().$subscribe(async (mutation, state) => {
  await forageSetItem(StorageNamesEnum.LGA_WARD_STREET, { ...state }, (err) => {
    // TODO: Implement nice error log
    console.log(
      `Encountered error while updating ${mutation.storeId} store.`,
      (err as Error)?.message
    );
  });
});
export default useLgaWardStreetStore;
