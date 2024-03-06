<template>
  <!-- title -->
  <q-card-section class="q-px-md">
    <div class="row justify-between q-py-sm">
      <title-badge> Add Subscriber </title-badge>
      <div><modal-popup-close /></div>
    </div>
  </q-card-section>
  <!-- form -->
  <q-card-section class="q-px-md">
    <q-form @submit.prevent ref="subscriberForm">
      <div class="row justify-between">
        <!-- left side -->
        <div class="q-gutter-xl">
          <!-- first name -->
          <q-input
            label="First Name"
            filled
            outlined
            v-model="subscriberModel.firstName"
            lazy-rules
            :rules="[() => $validateField(subscriberModel, 'firstName')]"
            ref="inputRef"
          />
          <!-- email -->
          <q-input
            label="Email"
            filled
            outlined
            v-model="subscriberModel.email"
            lazy-rules
            :rules="[() => $validateField(subscriberModel, 'email')]"
          />
          <!-- old code -->
          <q-input
            label="Old Code"
            filled
            outlined
            v-model="subscriberModel.oldCode"
            lazy-rules
            :rules="[() => $validateField(subscriberModel, 'oldCode')]"
          />
        </div>
        <!-- right side -->
        <div class="q-gutter-xl">
          <!-- last name -->
          <q-input
            label="Last Name"
            filled
            outlined
            v-model="subscriberModel.lastName"
            lazy-rules
            :rules="[() => $validateField(subscriberModel, 'lastName')]"
          />
          <!-- phone -->
          <div class="flex row">
            <q-select
              label="Country Phone Code"
              filled
              outlined
              label-color="dark"
              v-model="subscriberModel.phoneCodeId"
              :options="phoneCodeOptions"
              emit-value
              map-options
              clearable
            >
            </q-select>
            <q-input
              label="Phone"
              filled
              outlined
              v-model="subscriberModel.phone"
              lazy-rules
              :rules="[() => $validateField(subscriberModel, 'phone')]"
            />
          </div>
        </div>
      </div>
      <div class="flex row justify-center">
        <q-btn
          :style="{ width: '40%' }"
          label="Submit"
          rounded
          color="primary"
          type="submit"
          @click="addSubscriber"
        />
      </div>
    </q-form>
  </q-card-section>
</template>
<script setup lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  reactive,
  ref,
} from 'vue';
import TitleBadge from './TitleBadge.vue';
import { SubscriberModel } from 'src/models/Subscriber.model';
import { asyncComputed } from '@vueuse/core';
import ModalPopupClose from '../components/ModalPopupClose.vue';
import { onMounted } from 'vue';
import { EventBus, QForm, QInput, useQuasar } from 'quasar';
import { PropertySubscriptionHandler } from 'src/lib/eventHandlers/PropertySubscription.handler';
import { clearUIEffects, isModelValid } from 'src/lib/utils';
import { EventNamesEnum } from 'src/lib/enums/events.enum';
import { loadingTimeout } from 'src/lib/projectConstants';

defineComponent({
  name: 'add-subscriber',
});

// consts
const eventBus = inject('eventBus') as EventBus;
const $q = useQuasar();

// refs
const formRef = ref<HTMLFormElement>();
const inputRef = ref<QInput>();
formRef.value?.focus();
inputRef.value?.focus();
const phoneCodes = ref<{ name: string; id: string }[]>([]);
const subscriberForm = ref<QForm>();

// handlers
PropertySubscriptionHandler.handlePostSubscriberUser(eventBus, {
  onSuccess,
  onError,
});

// variables
let timer: NodeJS.Timeout;

// models
const subscriberModel = reactive(new SubscriberModel());

// computed
asyncComputed(async () => {
  await subscriberModel.validate();
});

const phoneCodeOptions = computed(() => {
  return phoneCodes.value?.map((phoneCode) => {
    return {
      label: phoneCode.name,
      value: phoneCode.id,
    };
  });
});

// methods
function addSubscriber() {
  //
  if (!isModelValid(subscriberModel)) {
    subscriberForm.value?.validate();
    return;
  }
  eventBus.emit(EventNamesEnum.POST_SUBSCRIBER, subscriberModel);
  $q.loading.show({
    message: 'Submitting ...',
  });
  // add timeout to  remove loading in case of an error that prevents request to complete
  timer = setTimeout(() => {
    $q.loading.hide();
  }, loadingTimeout);
}

function onSuccess() {
  subscriberModel.clearValues();
  clearUIEffects({ loader: $q.loading, timer: timer });
}

function onError() {
  clearUIEffects({ loader: $q.loading, timer: timer });
}

// life cycle
onMounted(async () => {
  console.log(inputRef.value?.focus);
  formRef.value?.focus();
  // inputRef.value?.;
  phoneCodes.value = await PropertySubscriptionHandler.getPhoneCodes();
});

onBeforeUnmount(() => {
  clearUIEffects({ loader: $q.loading, timer: timer });
  eventBus.off(EventNamesEnum.POST_SUBSCRIBER);
});
</script>
