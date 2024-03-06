import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { Router } from 'vue-router';
import localforage from 'localforage';

/**
 * Initialize localforage.
 */
localforage.config({
  name: 'Lawma_app_quasar',
  storeName: 'Lawma_app_storage',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia;
});

export type AuthUserData = {
  token?: string;
  userData?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    middleName?: string;
  };
  profile?: {
    id: string;
    profileTypeId: string;
    profileType: ProfileTypes;
    companyProfileId?: string;
  };
};

export enum ProfileTypes {
  ENTITY_USER_PROFILE = 'entity_user_profile',
  ENTITY_SUBSCRIBER_PROFILE = 'entity_subscriber_profile',
}

export enum StorageNamesEnum {
  AUTH_USER_DATA = 'auth_user_data',
  LGA_WARD_STREET = 'lga_ward_street',
}

export const storeforage = localforage;
