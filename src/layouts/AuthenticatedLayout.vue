<template>
  <q-layout view="lHh LpR fFf">
    <q-header
      bordered
      class="text-dark"
      :style="{ backgroundColor: $getColor('light-page') }"
    >
      <q-toolbar style="height: 6rem">
        <q-toolbar-title class="row justify-between">
          <q-badge
            v-if="pageTitle"
            class="text-h6 bg-accent"
            :style="{
              padding: '0.5rem',
              color: getColor('dark'),
              border: `0.1rem solid ${getColor('secondary')}`,
              borderRadius: '12px',
            }"
          >
            {{ pageTitle }}
          </q-badge>
          <div v-else></div>
          <lawma-app-badge />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-accent"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      persistent
      :width="240"
    >
      <!-- drawer content -->
      <q-card style="background-color: inherit">
        <q-card-section
          class="text-center flex flex-center"
          style="height: 25vh"
        >
          <div>Your logo here</div>
        </q-card-section>
      </q-card>
      <q-separator />
      <q-list class="q-mt-sm">
        <q-item
          to="/dashboard"
          :active-class="
            activePage === '/dashboard' ? 'bg-secondary text-black' : ''
          "
        >
          <q-icon
            name="dashboard"
            style="height: 3.5rem; width: 3.5rem"
          ></q-icon>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          to="properties-billings"
          :active-class="
            activePage === '/properties-billings'
              ? 'bg-secondary text-black'
              : ''
          "
        >
          <q-icon name="house" style="height: 3.5rem; width: 3.5rem"></q-icon>
          <q-item-section>
            <q-item-label>Properties And Billings </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          to="/payments"
          :active-class="
            activePage === '/payments' ? 'bg-secondary text-black' : ''
          "
        >
          <q-icon name="money" style="height: 3.5rem; width: 3.5rem"></q-icon>
          <q-item-section>
            <q-item-label>Payments</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div style="overflow-y: hidden">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { getCssVar, useMeta } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import LawmaAppBadge from 'src/components/LawmaAppBadge.vue';
import useAuthStore from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

// consts
const leftDrawerOpen = ref(true);
const router = useRouter();
const pageTitle = ref('Dashboard');
const authStore = useAuthStore();

// refs
const { token } = storeToRefs(authStore);

// computed
const activePage = computed(() => {
  return router.currentRoute.value.path;
});

// methods
function getRoutePath() {
  let routePath = router.currentRoute.value.path;
  // format path
  // format as sentence case
  routePath = routePath.replace('/', '').split('-').join(' ');
  routePath = routePath.charAt(0).toUpperCase() + routePath.slice(1);
  pageTitle.value = routePath;
  return routePath;
}

function getColor(
  colorAlias: 'secondary' | 'accent' | 'dark' | 'light-page' | 'dark-page'
) {
  return getCssVar(colorAlias);
}

useMeta(() => {
  return {
    title: getRoutePath(),
  };
});

onMounted(() => {
  console.log('Here is tht token value on mount', token);
});
</script>
