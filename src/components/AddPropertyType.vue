<template>
  <!-- title -->
  <q-card-section>
    <div class="flex row justify-between">
      <title-badge>Add Property Type</title-badge>
      <modal-popup-close />
    </div>
  </q-card-section>
  <!-- form -->
  <q-card-section>
    <q-form class="q-px-" @submit.prevent>
      <div class="q-gutter-md">
        <q-input
          label="Name"
          type="text"
          v-model="propertyTypeModel.name"
          filled
          outlined
          color="secondary"
          label-color="dark"
          :rules="[() => $validateField(propertyTypeModel, 'name')]"
        />
        <q-input
          label="Unit Price"
          type="number"
          v-model="propertyTypeModel.unitPrice"
          filled
          outlined
          color="secondary"
          label-color="dark"
          :rules="[() => $validateField(propertyTypeModel, 'unitPrice')]"
        />
      </div>
      <div class="flex row justify-center">
        <q-btn
          :style="{
            width: '40%',
          }"
          label="submit"
          type="submit"
          color="primary"
          rounded
          @click.prevent="onSubmit"
        />
      </div>
    </q-form>
  </q-card-section>
</template>
<script setup lang="ts">
import { asyncComputed } from '@vueuse/core';
import { PropertyTypeModel } from 'src/models/PropertyType.model';
import { inject, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import ModalPopupClose from '../components/ModalPopupClose.vue';
import TitleBadge from '../components/TitleBadge.vue';
import { PropertySubscriptionHandler } from 'src/lib/eventHandlers/PropertySubscription.handler';
import { EventBus, QForm, useQuasar } from 'quasar';
import { EventNamesEnum } from 'src/lib/enums/events.enum';
import { clearUIEffects, isModelValid } from 'src/lib/utils';

// refs
const propertyTypeForm = ref<QForm>();

// consts
const eventBus = inject('eventBus') as EventBus;
const $q = useQuasar();
let timer: NodeJS.Timeout;

// models
const propertyTypeModel = reactive(new PropertyTypeModel());

// computed

asyncComputed(async () => {
  await propertyTypeModel.validate();
});

// methods
function onSubmit() {
  //
  if (!isModelValid(propertyTypeModel)) {
    // validate
    propertyTypeForm.value?.validate();
  }
  $q.loading.show({
    message: 'Submitting ...',
  });

  eventBus.emit(EventNamesEnum.POST_PROPERTY_TYPE, propertyTypeModel);

  timer = setTimeout(() => {
    $q.loading.hide();
  }, 2000);
}

function onSuccess() {
  // clear form
  propertyTypeModel.clearValues();
  clearUIEffects({ loader: $q.loading, timer });
}

function onError() {
  clearUIEffects({ loader: $q.loading, timer });
}

onMounted(() => {
  // initializers
  PropertySubscriptionHandler.handlePostPropertyType(eventBus, {
    onSuccess,
    onError,
  });
});

// remove event listener
onBeforeUnmount(() => {
  eventBus.off(EventNamesEnum.POST_PROPERTY_TYPE);
});
</script>
