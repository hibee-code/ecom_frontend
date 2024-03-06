<template>
  <!-- <dialog-card> -->
  <q-card-section class="text-center">
    <title-badge>New Property Subscription</title-badge>
  </q-card-section>
  <q-card-section>
    <!-- form -->
    <q-form
      class="q-pa-md"
      :style="{ height: '100%' }"
      @submit.prevent
      ref="propertySubscriptionForm"
    >
      <!-- top -->
      <div class="row justify-between">
        <!-- left - form - side -->
        <div class="q-gutter-xl">
          <q-input
            :style="inputStyle"
            label="Property Name"
            type="text"
            v-model="newPropertySubscription.propertyName"
            filled
            outlined
            color="secondary"
            label-color="dark"
            :rules="[
              () => $validateField(newPropertySubscription, 'propertyName'),
            ]"
          />
          <q-input
            :style="inputStyle"
            label="Property Unit"
            type="text"
            v-model="newPropertySubscription.propertyUnit"
            filled
            outlined
            color="secondary"
            label-color="dark"
            :rules="[
              () => $validateField(newPropertySubscription, 'propertyUnit'),
            ]"
          />
          <q-input
            :style="inputStyle"
            label="Expected Monthly Cost"
            type="text"
            v-model="newPropertySubscription.expectedMonthlyCost"
            filled
            outlined
            color="secondary"
            label-color="dark"
          >
            <q-tooltip>Expected Monthly Cost</q-tooltip>
          </q-input>
          <q-input
            :style="inputStyle"
            label="Old Code"
            type="text"
            v-model="newPropertySubscription.oldCode"
            filled
            outlined
            color="secondary"
            label-color="dark"
          />
        </div>
        <!-- right - form - side -->
        <div class="q-gutter-xl">
          <div class="row" :style="selectStyle">
            <q-select
              style="width: 70%"
              label="Street"
              filled
              outlined
              v-model="newPropertySubscription.streetId"
              color="secondary"
              label-color="dark"
              :options="streetOptions"
              :rules="[
                () => $validateField(newPropertySubscription, 'streetId'),
              ]"
              clearable
              emit-value
              map-options
            >
              <template v-slot:append>
                <q-btn
                  round
                  flat
                  dense
                  icon="add"
                  @click.prevent.stop="onSelecButtonClicked('addStreet')"
                />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    <q-btn
                      flat
                      dense
                      label="Add Street"
                      @click="onSelecButtonClicked('addStreet')"
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              style="width: 30%"
              label="Number"
              type="text"
              v-model="newPropertySubscription.streetNumber"
              filled
              outlined
              color="secondary"
              label-color="dark"
              ><q-tooltip>Street Number</q-tooltip></q-input
            >
          </div>
          <div :style="selectStyle">
            <q-select
              style="width: 100%"
              label="Property Type"
              filled
              outlined
              v-model="newPropertySubscription.propertyTypeId"
              color="secondary"
              label-color="dark"
              :options="propertyTypesOptions"
              clearable
              :rules="[
                () => $validateField(newPropertySubscription, 'propertyTypeId'),
              ]"
              emit-value
              map-options
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  @click.prevent.stop="onSelecButtonClicked('addPropertyType')"
                />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    <q-btn
                      dense
                      flat
                      label="Add Property Type"
                      @click="onSelecButtonClicked('addPropertyType')"
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div :style="selectStyle">
            <q-select
              style="width: 100%"
              label="Custodian"
              filled
              outlined
              v-model="newPropertySubscription.propertySubscriberProfileId"
              color="secondary"
              label-color="dark"
              clearable
              :options="custodianOptions"
              :rules="[
                () =>
                  $validateField(
                    newPropertySubscription,
                    'propertySubscriberProfileId'
                  ),
              ]"
              emit-value
              map-options
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  @click.prevent.stop="onSelecButtonClicked('addSubscriber')"
                />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    <q-btn
                      dense
                      flat
                      label="Add Subscriber"
                      @click="onSelecButtonClicked('addSubscriber')"
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div :style="{ width: '20rem' }">
            <q-checkbox
              label="Is Owner"
              v-model="newPropertySubscription.isOwner"
              color="primary"
            />
          </div>
        </div>
      </div>
      <!-- button submit area -->
      <div class="row justify-center q-mt-xl" :style="{ width: '100%' }">
        <q-btn
          :style="{ width: '40%' }"
          label="Submit"
          rounded
          color="primary"
          type="submit"
          @click.prevent="onSubmit"
        ></q-btn>
      </div>
      <!-- down -->
    </q-form>
  </q-card-section>
  <!-- </dialog-card> -->
</template>
<script setup lang="ts">
import {
  StyleValue,
  computed,
  defineComponent,
  onBeforeUnmount,
  reactive,
  ref,
} from 'vue';
import { PropertySubscriptionModel } from '../models/PropertySubscription.model';
import TitleBadge from './TitleBadge.vue';
import { inject, watch } from 'vue';
import { EventNamesEnum } from 'src/lib/enums/events.enum';
import { EventBus, QSelect, QBtn, useQuasar, QForm } from 'quasar';
import { PropertySubscriptionHandler } from '../lib/eventHandlers/PropertySubscription.handler';
import { SubscriberModel } from '../models/Subscriber.model';
import { PropertyTypeModel } from 'src/models/PropertyType.model';
import { asyncComputed } from '@vueuse/core';
import { onMounted } from 'vue';
import { clearUIEffects, isModelValid } from 'src/lib/utils';
import { loadingTimeout } from 'src/lib/projectConstants';
import useLgaWardStreetStore from 'src/stores/lga-ward-street';
import { storeToRefs } from 'pinia';

defineComponent({
  name: 'new-property-subscription',
});

const emit = defineEmits<{
  (e: 'addSubscriber'): void;
  (e: 'addPropertyType'): void;
  (e: 'addStreet'): void;
}>();

// consts
const eventBus = inject('eventBus') as EventBus;
const selectStyle: StyleValue = {
  width: '35rem',
};
const inputStyle: StyleValue = {
  width: '30rem',
};
const $q = useQuasar();

// initializers
PropertySubscriptionHandler.handlePostSubscription(eventBus, {
  onSuccess,
  onError,
});

/// store
const LgaWardStreetStore = useLgaWardStreetStore();

// variables
let timer: NodeJS.Timeout;

// refs
const propertySubscriptionForm = ref<QForm>();
const subscribers = ref<SubscriberModel[]>([]);
const propertyTypes = ref<PropertyTypeModel[]>([]);
const { streets } = storeToRefs(LgaWardStreetStore);

// model
const newPropertySubscription = reactive(new PropertySubscriptionModel());

// computed
const custodianOptions = computed(() => {
  return subscribers.value.map((subscriber) => {
    return {
      label: subscriber.firstName + ' ' + subscriber.lastName,
      value: subscriber.id,
    };
  });
});

const propertyTypesOptions = computed(() => {
  return propertyTypes.value.map((propertytype) => {
    return {
      label: `${propertytype.name} - ${propertytype.unitPrice}`,
      value: propertytype.id,
    };
  });
});

const streetOptions = computed(() => {
  return streets?.value?.map((street) => {
    return {
      label: street.name,
      value: street.id,
    };
  });
});

asyncComputed(async () => {
  newPropertySubscription.validate();
});

// methods
async function onSubmit() {
  // validate
  newPropertySubscription.validate();
  if (!isModelValid(newPropertySubscription)) {
    console.log('the following errors exist', newPropertySubscription.errors);
    await propertySubscriptionForm.value?.validate();
    return;
  }
  $q.loading.show({
    message: 'Submitting ...',
  });
  eventBus.emit(
    EventNamesEnum.NEW_PROPERTY_SUBSCRIPTION,
    newPropertySubscription
  );

  timer = setTimeout(() => {
    $q.loading.hide();
  }, loadingTimeout);
}

function onSuccess() {
  //clear form
  newPropertySubscription.clearValues();
  clearUIEffects({ loader: $q.loading, timer });
}

function onError() {
  clearUIEffects({ loader: $q.loading, timer });
}

function onSelecButtonClicked(
  eventNameToEmit: 'addSubscriber' | 'addPropertyType' | 'addStreet'
) {
  emit(eventNameToEmit as unknown as never);
}

// watcher
watch(
  [
    () => newPropertySubscription.propertyTypeId,
    () => newPropertySubscription.propertyUnit,
  ],
  ([newValue, propertyUnit]) => {
    if (newValue && propertyUnit) {
      const propertyType = propertyTypes.value.find(
        (prop) => prop.id === newValue
      );

      newPropertySubscription.expectedMonthlyCost = String(
        Number(propertyType?.unitPrice) * propertyUnit
      );
      return newPropertySubscription.expectedMonthlyCost;
    }
  }
);

onMounted(async () => {
  //
  try {
    streets?.value || LgaWardStreetStore.fetchServerData({ type: 'street' });
    propertyTypes.value = await PropertySubscriptionHandler.getPropertyTypes();
    subscribers.value = await PropertySubscriptionHandler.getSubscriberUsers();
  } catch (error) {
    console.log(error);
  }
});

onBeforeUnmount(() => {
  eventBus.off(EventNamesEnum.NEW_PROPERTY_SUBSCRIPTION);
});
</script>
