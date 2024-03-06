<template>
  <q-card-section>
    <div class="flex row justify-between">
      <title-badge>Add L.G.A.</title-badge>
      <ModalPopupClose />
    </div>
  </q-card-section>
  <q-card-section>
    <form>
      <div>
        <q-input
          label="Name"
          filled
          outlined
          label-color="dark"
          v-model="lgaModel.name"
          :rules="[() => $validateField(lgaModel, 'name')]"
        />
      </div>
      <div class="flex row justify-center q-mt-lg">
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
    </form>
  </q-card-section>
</template>
<script setup lang="ts">
import { LGAModel } from 'src/models/lga.model';
import TitleBadge from '../components/TitleBadge.vue';
import ModalPopupClose from './ModalPopupClose.vue';
import { reactive, defineComponent, inject, onBeforeUnmount } from 'vue';
import { asyncComputed } from '@vueuse/core';
import { LgaWardStreetHandler } from 'src/lib/eventHandlers/LgaWardStreet.handler';
import { EventBus, useQuasar } from 'quasar';
import { EventNamesEnum } from 'src/lib/enums/events.enum';
import { clearUIEffects, isModelValid } from 'src/lib/utils';
import { loadingTimeout } from 'src/lib/projectConstants';

defineComponent({
  name: 'add-lga',
});

// injections
const eventBus = inject('eventBus') as EventBus;

// consts
const $q = useQuasar();
let postLgaTimer: NodeJS.Timeout;

// model
const lgaModel = reactive(new LGAModel());

// controllers
LgaWardStreetHandler.handlePostLga(eventBus, { onSuccess, onError });

// computed
asyncComputed(async () => {
  lgaModel.validate();
});

// methods
function onSubmit() {
  //
  if (!isModelValid(lgaModel)) return;
  $q.loading.show({
    message: 'Submitting ...',
  });
  eventBus.emit(EventNamesEnum.POST_LGA, lgaModel);
  postLgaTimer = setTimeout(() => {
    $q.loading.hide();
  }, loadingTimeout);
}

function onSuccess() {
  // clear form
  lgaModel.clearValues();
  clearUIEffects({ loader: $q.loading, timer: postLgaTimer });
}

function onError() {
  clearUIEffects({ loader: $q.loading, timer: postLgaTimer });
}

// lifecycle hooks
onBeforeUnmount(() => {
  clearUIEffects({ loader: $q.loading, timer: postLgaTimer });
});

// remove event listener
onBeforeUnmount(() => {
  eventBus.off(EventNamesEnum.POST_LGA);
});
</script>
