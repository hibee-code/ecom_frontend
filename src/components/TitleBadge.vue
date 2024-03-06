<template>
  <q-badge
    :class="`text-${headerTextSize} bg-${bgColor}`"
    :style="{
      padding: '0.5rem',
      color: $getColor(color),
      border: `0.1rem solid ${$getColor('secondary')}`,
      borderRadius: '12px',
    }"
  >
    <div><slot></slot></div>
  </q-badge>
</template>
<script setup lang="ts">
import { defineComponent } from 'vue';

// consts
export interface TitleBadgeProps {
  bgColor?: string;
  color?: string;
  borderColor?: string;
  titleHeading?: string;
  headerTextSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

withDefaults(defineProps<TitleBadgeProps>(), {
  bgColor: 'secondary',
  color: 'dark',
  borderColor: 'secondary',
  titleHeading: 'Lawma App',
  headerTextSize: 'h5',
});

defineComponent({
  name: 'title-badge',
});
</script>
