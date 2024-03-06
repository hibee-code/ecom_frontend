<template>
  <q-badge
    class="text-body1 text-bold"
    :style="{
      border: `0.1rem solid  ${$getColor(color)}`,
      backgroundColor: 'transparent',
      padding: '1rem 0.5rem',
      color: $getColor(color),
      cursor: 'pointer',
    }"
    @click="$router.push({ path: '/auth/signin' })"
    >Lawma App</q-badge
  >
</template>
<script setup lang="ts">
import { defineComponent } from 'vue';

defineProps({
  /**
   * Use color name that can be obtained via getCssVar
   */
  color: {
    type: String,
    default: 'dark',
  },
});

defineComponent({
  name: 'LawmaAppBadge',
});
</script>
