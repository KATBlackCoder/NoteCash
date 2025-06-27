<script setup lang="ts">
import { NButton } from 'naive-ui';
import { Sun, Moon } from '@vicons/carbon';
import { NIcon } from 'naive-ui';
import { useThemeStore } from '../../stores/theme';
import { storeToRefs } from 'pinia';

// Use theme store
const themeStore = useThemeStore();
const { themeMode } = storeToRefs(themeStore);

// Toggle theme function
const toggleTheme = () => {
  themeStore.toggleTheme();
};
</script>

<template>
  <div class="theme-toggle">
    <n-button tertiary circle @click="toggleTheme">
      <n-icon size="20">
        <Sun v-if="themeMode === 'light'" />
        <Moon v-else />
      </n-icon>
    </n-button>
    <span class="theme-label">{{ themeMode.charAt(0).toUpperCase() + themeMode.slice(1) }}</span>
  </div>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-label {
  font-size: 0.8rem;
  text-transform: capitalize;
}
</style> 