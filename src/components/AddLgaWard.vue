<template>
  <q-card-section>
    <div class="flex row justify-between">
      <title-badge>Add L.G.A. Ward</title-badge>
      <ModalPopupClose />
    </div>
  </q-card-section>
  <q-card-section>
    <q-form ref="lgaWardForm">
      <div>
        <q-input
          label="Name"
          filled
          outlined
          label-color="dark"
          v-model="lgaWardModel.name"
          :rules="[() => $validateField(lgaWardModel, 'name')]"
        />
        <q-select
          label="Select L.G.A."
          filled
          outlined
          label-color="dark"
          v-model="lgaWardModel.lgaId"
          :options="lgaOptions"
          :rules="[() => $validateField(lgaWardModel, 'lgaId')]"
          emit-value
          map-options
          clearable
        >
          <template v-slot:append>
            <q-btn flat round dense icon="add" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section>
                <q-btn label="Create L.G.A." flat dense />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
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
    </q-form>
  </q-card-section>
</template>
<script setup lang="ts">
import { LGAWardModel } from 'src/models/lgaWard.model';
import TitleBadge from '../components/TitleBadge.vue';
import ModalPopupClose from './ModalPopupClose.vue';
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue';
import { asyncComputed } from '@vueuse/core';
import { LGAModel } from 'src/models/lga.model';
import { defineComponent } from 'vue';
import { LgaWardStreetHandler } from 'src/lib/eventHandlers/LgaWardStreet.handler';
import { EventBus, QForm, useQuasar } from 'quasar';
import { EventNamesEnum } from 'src/lib/enums/events.enum';
import { clearUIEffects, isModelValid } from 'src/lib/utils';
import { loadingTimeout } from 'src/lib/projectConstants';

defineComponent({
  name: 'add-lga-ward',
});

// refs
// const isLoading = ref(false);
const lgas = ref<LGAModel[]>([]);
const lgaWardForm = ref<QForm>();

// consts
const eventBus = inject('eventBus') as EventBus;
const $q = useQuasar();

// variable
let postLgaTimer: NodeJS.Timeout;

// model
const lgaWardModel = reactive(new LGAWardModel());

// controllers
LgaWardStreetHandler.handlePostLgaWard(eventBus, { onSuccess, onError });

// computed
asyncComputed(async () => {
  console.log('this is the lgaWardId: ', lgaWardModel.lgaId);
  lgaWardModel.validate();
});

const lgaOptions = computed(() => {
  return lgas.value.map((lga) => {
    return {
      label: lga.name,
      value: lga.id,
    };
  });
});

// methods
function onSubmit() {
  //
  if (!isModelValid(lgaWardModel)) {
    lgaWardModel.validate();
    return;
  }
  $q.loading.show({
    message: 'Submitting ...',
  });
  eventBus.emit(EventNamesEnum.POST_LGA_WARD, lgaWardModel);
  postLgaTimer = setTimeout(() => {
    $q.loading.hide();
  }, loadingTimeout);
}

function onSuccess() {
  // clear form
  lgaWardModel.clearValues();
  clearUIEffects({ loader: $q.loading, timer: postLgaTimer });
}

function onError() {
  //
  clearUIEffects({ loader: $q.loading, timer: postLgaTimer });
}

// lifecycle hooks
onMounted(async () => {
  // fetch lga model
  lgas.value = await LgaWardStreetHandler.getLgas();
});

onBeforeUnmount(() => {
  clearUIEffects({ loader: $q.loading, timer: postLgaTimer });
});
</script>
