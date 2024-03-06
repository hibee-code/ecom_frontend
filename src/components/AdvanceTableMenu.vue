<template>
  <q-fab
    color="transparent"
    text-color="black"
    icon="keyboard_arrow_left"
    direction="left"
    padding="xs"
    margin="xs"
  >
    <q-fab-action
      v-for="menuItem in menuItems"
      :key="menuItem.label"
      :icon="menuItem.icon"
      :color="menuItem.color"
      :text-color="menuItem.textColor"
      padding="xs"
      @click="$emit('menuItemClickHandler', menuItem)"
      ><q-tooltip>{{ menuItem.label }}</q-tooltip></q-fab-action
    >
  </q-fab>
</template>
<script setup lang="ts">
import { defineComponent, defineEmits } from 'vue';

defineComponent({
  name: 'advance-table-menu',
});

export interface AdvanceTableMenuProps {
  menuItems: {
    label: string;
    icon: string;
    textColor?: string;
    color?: string;
  }[];
  padding?: string;
}

defineEmits<{
  (
    name: 'menuItemClickHandler',
    menuItem: {
      label: string;
      icon: string;
      color?: string;
      textColor?: string;
    }
  ): void;
}>();

withDefaults(defineProps<AdvanceTableMenuProps>(), {
  menuItems: () => [],
  padding: 'xs',
});
</script>
