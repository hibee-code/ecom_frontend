<template>
  <q-page :style-fn="pageStyleFunc">
    <div
      :style="{
        backgroundColor: `${$getColor('light-page')}`,
        padding: '10rem 1rem 0 1rem',
        height: '100vh',
        width: '100%',
      }"
    >
      <!-- Payment History -->
      <div>
        <h5>{{ paymentTableTitle }}</h5>
      </div>
      <!-- Month Selection Component -->
      <!-- Button  -->
      <div class="q-my-lg flex row justify-between">
        <q-select
          v-model="paymentMonth"
          label="Month"
          filled
          outlined
          label-color="dark"
          :options="paymentMonthsOptions"
          clearable
          map-options
          emit-value
        ></q-select>
        <q-btn
          label="Post Payment"
          color="primary"
          rounded
          @click="showPaymentFormDialog = true"
        />
      </div>
      <!-- Table -->
      <div>
        <q-card rounded class="bg-accent">
          <q-card-section>
            <q-table
              :rows="paymentTableRows"
              bordered
              :columns="paymentColumns"
              :table-header-style="{
                backgroundColor: `${$getColor('secondary')}`,
              }"
            ></q-table>
          </q-card-section>
        </q-card>
      </div>

      <q-dialog v-model="showPaymentFormDialog" style="min-width: 20rem">
        <dialog-card height="auto">
          <q-card-section class="text-center">
            <title-badge>Post Payment</title-badge>
          </q-card-section>
          <q-card-section class="q-px-lg flex column justify-between">
            <q-form ref="paymentFormRef" @submit.prevent="">
              <!-- write fields for the following
                - select field for property Name
                - input field payer name
                - date field for date
                - input field for amount
                - input field for paid by
                -->
              <div class="flext row justify-between">
                <div class="flex column justify-between" style="width: 40%">
                  <div>
                    <q-select
                      v-model="paymentModel.propertySubscriptionId"
                      label="Property Name"
                      label-color="dark"
                      filled
                      outlined
                      color="secondary"
                      clearable
                      :rules="[
                        () =>
                          $validateField(
                            paymentModel,
                            'propertySubscriptionId'
                          ),
                      ]"
                      :options="propertySubscriptionOptions"
                      map-options
                      emit-value
                    ></q-select>
                  </div>
                  <div>
                    <q-input
                      v-model="paymentModel.payerName"
                      label="Payer Name"
                      label-color="dark"
                      filled
                      outlined
                      color="secondary"
                      clearable
                      :rules="[() => $validateField(paymentModel, 'payerName')]"
                    />
                  </div>
                </div>
                <div class="flex column justify-between" style="width: 40%">
                  <div class="q-mb-lg">
                    <q-input
                      filled
                      v-model="paymentModel.paymentDate"
                      mask="date"
                      label="Payment Date"
                      label-color="dark"
                      outlined
                      :rules="[
                        () => $validateField(paymentModel, 'paymentDate'),
                      ]"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="paymentModel.paymentDate"
                              title="Select Date"
                              today-btn
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div>
                    <q-input
                      v-model="paymentModel.amount"
                      label="Amount"
                      outlined
                      filled
                      label-color="dark"
                      color="secondary"
                      :rules="[() => $validateField(paymentModel, 'amount')]"
                    />
                  </div>
                </div>
              </div>
              <div class="flex row justify-center q-mt-lg">
                <q-btn
                  :style="{
                    width: '40%',
                  }"
                  label="Submit"
                  color="primary"
                  rounded
                  @click="onSubmit"
                />
              </div>
            </q-form>
          </q-card-section>
        </dialog-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { EventBus, QForm, QTableColumn, useQuasar } from 'quasar';
import { months } from 'src/lib/projectConstants';
import { computed, inject, reactive, ref, watch } from 'vue';
import DialogCard from '../components/DialogCard.vue';
import TitleBadge from '../components/TitleBadge.vue';
import { PaymentModel } from '../models/Payment.model';
import { asyncComputed } from '@vueuse/core';
import { PaymentRecord, PropertySubscription } from 'src/lib/types/types';
import { onMounted } from 'vue';
import { PropertySubscriptionHandler } from 'src/lib/eventHandlers/PropertySubscription.handler';
import { EventNamesEnum } from 'src/lib/enums/events.enum';
import { clearUIEffects, isModelValid } from 'src/lib/utils';
import { PaymentHandler } from 'src/lib/eventHandlers/paymentHandler.handler';
import { onBeforeUnmount } from 'vue';

// consts
const monthNow = months[new Date().getMonth() + 1];
const eventBus = inject('eventBus') as EventBus;
const $q = useQuasar();

// variables
let timer: NodeJS.Timeout;

// props
const paymentColumns: QTableColumn[] = [
  {
    name: 'payerName',
    required: true,
    label: 'Payer Name',
    align: 'left',
    field: 'payerName',
  },
  {
    name: 'paymentDate',
    required: true,
    label: 'PaymentDate',
    align: 'left',
    field: 'paymentDate',
  },
  {
    name: 'propertySubscriptionName',
    required: true,
    label: 'Property Subscription Name',
    align: 'left',
    field: 'propertySubscriptionName',
  },
  {
    name: 'amount',
    required: true,
    label: 'Amount',
    align: 'left',
    field: 'amount',
  },
];

const paymentModel = reactive(new PaymentModel());

// refs
const paymentMonth = ref(monthNow);
const paymentTableTitle = ref('Payment History');
const showPaymentFormDialog = ref(false);
const propertySubscriptions = ref<PropertySubscription[]>();
const paymentFormRef = ref<QForm>();
const payments = ref<PaymentRecord[]>([]);

// handlers
PaymentHandler.handlePostPayment(eventBus, {
  onSuccess: onPaymentPostSuccess,
  onError: onPaymentPostError,
});

// computed
const paymentTableRows = computed(() => {
  return payments.value;
});

const propertySubscriptionOptions = computed(() => {
  return propertySubscriptions.value?.map((value) => {
    return {
      label: value.propertySubscriptionName,
      value: value.propertySubscriptionId,
    };
  });
});

const paymentMonthsOptions = computed(() => {
  return Object.values(months).map((value) => value);
});

asyncComputed(async () => {
  await paymentModel.validate();
});

// methods
async function onSubmit() {
  //
  await paymentModel.validate();
  await paymentFormRef.value?.validate();
  if (!isModelValid(paymentModel)) {
    return;
  }

  $q.loading.show({
    message: 'Please, wait ...',
  });

  eventBus.emit(EventNamesEnum.POST_PAYMENT, paymentModel);
}

function onPaymentPostSuccess() {
  clearUIEffects({ loader: $q.loading, timer: timer });
}

function onPaymentPostError() {
  clearUIEffects({ loader: $q.loading, timer: timer });
}
function pageStyleFunc(offset: number) {
  // "offset" is a Number (pixels) that refers to the total
  // height of header + footer that occupies on screen,
  // based on the QLayout "view" prop configuration

  // this is actually what the default style-fn does in Quasar
  return {
    minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh',
    padding: '0',
    margin: '-40px 0',
    overflowY: 'hidden',
  };
}

// watcher
watch(paymentMonth, async (newValue) => {
  paymentTableTitle.value = `Payment History (${newValue})`;
  payments.value = await PaymentHandler.getPayments({
    month: newValue,
  });
});

//life cycle hooks
onMounted(async () => {
  propertySubscriptions.value =
    await PropertySubscriptionHandler.getSubscriptions();
});

onMounted(async () => {
  payments.value = await PaymentHandler.getPayments({
    month: paymentMonth.value,
  });
});

onMounted(() => {
  paymentTableTitle.value = `Payment History (${paymentMonth.value})`;
  paymentModel.paymentDate = new Date().toISOString();
});

onBeforeUnmount(() => {
  eventBus.off(EventNamesEnum.POST_PAYMENT);
});
</script>
