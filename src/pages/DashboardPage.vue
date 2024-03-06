<template>
  <q-page>
    <div
      :style="{
        backgroundColor: `${$getColor('light-page')}`,
        padding: '3rem 1rem',
        width: '100%',
      }"
    >
      <div
        class="flex column justify-evenly q-gutter-lg q-mb-xl"
        :style="{ width: '99.6%' }"
      >
        <!-- first level metrics -->
        <div class="flex row justify-evenly" style="height: 10rem; width: 100%">
          <div style="max-height: max-content; width: 33%">
            <!-- Number of subscribers -->
            <q-card
              class="q-pa-sm flex column flex-center"
              :style="{
                height: '9rem',
                width: '100%',
                backgroundColor: `${$getColor('accent')}`,
              }"
            >
              <q-card-section class="text-h6" style="display: block"
                >{{ dashboardMetrics.subscriberCount }}
              </q-card-section>
              <q-card-section class="text-h6 text-bolder"
                >Number of subscribers</q-card-section
              >
            </q-card>
          </div>
          <div style="max-height: max-content; width: 33%">
            <!-- Number of street -->
            <q-card
              class="q-pa-sm flex column flex-center"
              :style="{
                height: '9rem',
                width: '100%',
                backgroundColor: `${$getColor('accent')}`,
              }"
            >
              <q-card-section class="text-h6">{{
                dashboardMetrics.streetCount
              }}</q-card-section>
              <q-card-section class="text-h6 text-bolder">
                Number of street</q-card-section
              >
            </q-card>
          </div>
          <div style="max-height: max-content; width: 33%">
            <!-- Number of properties -->
            <q-card
              class="q-pa-sm flex column flex-center"
              :style="{
                height: '9rem',
                width: '100%',
                backgroundColor: `${$getColor('accent')}`,
              }"
            >
              <q-card-section class="text-h6"
                >{{ dashboardMetrics.properitesCount }}
              </q-card-section>
              <q-card-section class="text-h6 text-bolder"
                >Number of properties
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- second level metrics -->
        <div class="flex row justify-around" style="width: 100%">
          <div style="width: 99%">
            <!-- Payments / Billings across months -->
            <q-card
              :style="{
                height: '24rem',
                backgroundColor: `${$getColor('accent')}`,
              }"
            >
              <apexchart
                type="line"
                height="360"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </q-card>
          </div>
        </div>
        <!-- third level metrics -->
        <div
          class="flex row justify-around"
          :style="{
            height: '9rem',
            width: '100%',
          }"
        >
          <div style="width: 49.5%">
            <!-- Total Billings for month -->
            <q-card
              class="q-pa-sm flex column flex-center"
              :style="{
                height: '9rem',
                width: '100%',
                backgroundColor: `${$getColor('accent')}`,
              }"
            >
              <q-card-section class="text-h6">{{
                dashboardMetrics.totalBillings
              }}</q-card-section>
              <q-card-section class="text-h6 text-bolder">
                Total Billings for month</q-card-section
              >
            </q-card>
          </div>
          <div style="width: 49.5%">
            <!-- Total Payments for month -->
            <q-card
              class="q-pa-sm flex column flex-center"
              :style="{
                height: '9rem',
                width: '100%',
                backgroundColor: `${$getColor('accent')}`,
              }"
            >
              <q-card-section class="text-h6">{{
                dashboardMetrics.totalPayments
              }}</q-card-section>
              <q-card-section class="text-h6 text-bolder">
                Total Payments for month</q-card-section
              >
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { DashboardHandler } from 'src/lib/eventHandlers/Dashboard.handler';
import { computed, onMounted, ref, watch } from 'vue';

// refs
const dashboardMetrics = ref<{
  streetCount: number;
  subscriberCount: number;
  properitesCount: number;
  totalBillings: number;
  totalPayments: number;
  billingAcrossMonths: { month: string; amount: string }[];
  paymentsAcrossMonths: { month: string; amount: string }[];
}>({
  streetCount: 0,
  subscriberCount: 0,
  properitesCount: 0,
  totalBillings: 0,
  totalPayments: 0,
  billingAcrossMonths: [],
  paymentsAcrossMonths: [],
});
const fetchCount = ref(1);
const chartOptions = ref({
  chart: {
    id: 'chart',
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
});

// const series = computed(() => [
//   {
//     name: 'Payments',
//     data: dashboardMetrics.value.paymentsAcrossMonths.map((payment) => {
//       return parseInt(payment.amount);
//     }),
//   },
//   {
//     name: 'Billings',
//     data: dashboardMetrics.value.billingAcrossMonths.map((billing) => {
//       return parseInt(billing.amount);
//     }),
//   },
// ]);

const series = ref([
  {
    name: 'Payments',
    data: [
      40000, 50000, 60000, 20000, 80000, 90000, 100000, 110000, 120000, 130000,
      140000, 150000,
    ],
  },
  {
    name: 'Billings',
    data: [
      20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000,
      120000, 130000,
    ],
  },
]);

// watchers
watch(fetchCount, async (newValue) => {
  if (newValue > 1 && newValue < 3) {
    try {
      dashboardMetrics.value = await DashboardHandler.getDashboardMetrics();
    } catch (err) {
      console.log('Could not fetch dashboard metrics');
    }
  }
});

// life cycle hooks
onMounted(async () => {
  try {
    dashboardMetrics.value = await DashboardHandler.getDashboardMetrics();
  } catch (err) {
    if (fetchCount.value < 3) {
      fetchCount.value++;
    } else {
      console.log('Could not fetch dashboard metrics');
    }
  }
});
</script>
