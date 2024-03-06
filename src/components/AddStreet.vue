<template>
  <!-- title -->
  <q-card-section>
    <div class="flex row justify-between">
      <title-badge>Add Street</title-badge>
      <modal-popup-close />
    </div>
  </q-card-section>
  <!-- form -->
  <q-card-section>
    <q-form class="q-px-lg" @submit.prevent ref="addStreetForm">
      <div class="q-gutter-xl">
        <q-input
          label="Street Name"
          type="text"
          v-model="streetModel.name"
          filled
          outlined
          color="secondary"
          label-color="dark"
          :rules="[() => $validateField(streetModel, 'name')]"
        />
        <q-select
          label="Lga"
          filled
          outlined
          color="secondary"
          label-color="dark"
          :options="lgaOptions"
          :rules="[() => $validateField(streetModel, 'lgaId')]"
          v-model="streetModel.lgaId"
          emit-value
          map-options
          clearable
        >
          <template v-slot:append>
            <q-btn
              round
              flat
              dense
              icon="add"
              @click.prevent.stop="
                emitEvent(EventNamesEnum.TRIGGER_REMOTE_MODAL_LGA)
              "
            />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                <q-btn
                  label="Add LGA"
                  dense
                  flat
                  @click="emitEvent(EventNamesEnum.TRIGGER_REMOTE_MODAL_LGA)"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          label="LGA Ward"
          filled
          outlined
          color="secondary"
          label-color="dark"
          :options="lgaWardOptions"
          :rules="[() => $validateField(streetModel, 'lgaWardId')]"
          v-model="streetModel.lgaWardId"
          emit-value
          map-options
          clearable
        >
          <template v-slot:append>
            <q-btn
              round
              flat
              dense
              icon="add"
              @click.prevent.stop="
                emitEvent(EventNamesEnum.TRIGGER_REMOTE_MODAL_LGA_WARD)
              "
            />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                <q-btn
                  label="Add LGA Ward"
                  flat
                  dense
                  @click="
                    emitEvent(EventNamesEnum.TRIGGER_REMOTE_MODAL_LGA_WARD)
                  "
                />
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
          @click="onSubmit"
        />
      </div>
    </q-form>
  </q-card-section>
</template>
<script setup lang="ts">
import { asyncComputed } from '@vueuse/core';
import { StreetModel } from 'src/models/Street.model';
import { LGAModel } from 'src/models/lga.model';
import { LGAWardModel } from 'src/models/lgaWard.model';
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import ModalPopupClose from '../components/ModalPopupClose.vue';
import TitleBadge from '../components/TitleBadge.vue';
import { defineComponent } from 'vue';
import { EventBus, QForm, useQuasar } from 'quasar';
import { EventNamesEnum } from 'src/lib/enums/events.enum';
import { LgaWardStreetHandler } from 'src/lib/eventHandlers/LgaWardStreet.handler';
import { clearUIEffects, isModelValid } from 'src/lib/utils';
import { loadingTimeout } from 'src/lib/projectConstants';

defineComponent({
  name: 'add-street',
});

defineEmits<{
  (e: 'addLga'): void;
  (e: 'addLgaWard'): void;
}>();

// consts
const lgas = ref<LGAModel[]>([]);
const lgaWards = ref<LGAWardModel[]>([]);
const eventBus = inject('eventBus') as EventBus;
const $q = useQuasar();

// refs
const addStreetForm = ref<QForm>();
const requesting = ref(false);

// variables
let postStreetTimer: NodeJS.Timeout;

// models
const streetModel = reactive(new StreetModel());

// controllers
LgaWardStreetHandler.handlePostStreet(eventBus, { onSuccess, onError });

// computed
const lgaOptions = computed(() =>
  lgas.value.map((lga) => {
    return {
      label: lga.name,
      value: lga.id,
    };
  })
);

const lgaWardOptions = computed(() =>
  lgaWards.value.map((lgaWard) => {
    return {
      label: lgaWard.name,
      value: lgaWard.id,
    };
  })
);

asyncComputed(async () => {
  await streetModel.validate();
});

// methods
function onSubmit() {
  if (requesting.value) {
    return;
  }
  //
  if (!isModelValid(streetModel)) {
    addStreetForm.value?.validate();
    return;
  }
  requesting.value = true;
  $q.loading.show({
    message: 'Submitting ...',
  });
  eventBus.emit(EventNamesEnum.POST_STREET, streetModel);
  postStreetTimer = setTimeout(() => {
    $q.loading.hide();
  }, loadingTimeout);
}

function onSuccess() {
  // clear form
  streetModel.clearValues();
  clearUIEffects({ loader: $q.loading, timer: postStreetTimer });
}

function onError() {
  clearUIEffects({ loader: $q.loading, timer: postStreetTimer });
}

// events invocation
function emitEvent(eventName: EventNamesEnum) {
  eventBus.emit(eventName);
}

// watcher
watch(
  () => streetModel.lgaId,
  async (newValue) => {
    lgaWards.value = await LgaWardStreetHandler.getLgaWards({
      lgaId: newValue,
    });
  }
);

// lifecycle hooks
onMounted(async () => {
  //
  lgas.value = await LgaWardStreetHandler.getLgas();
});

onBeforeUnmount(() => {
  clearUIEffects({ loader: $q.loading, timer: postStreetTimer });
});

// remove event listener
onBeforeUnmount(() => {
  eventBus.off(EventNamesEnum.POST_STREET);
});
</script>
