<script setup lang="ts">
import { NConfigProvider, NGlobalStyle, NDialogProvider, NMessageProvider, NNotificationProvider } from 'naive-ui';
import { provide } from 'vue';
import { useThemeStore } from './stores/theme';

// Use theme store
const themeStore = useThemeStore();

// Provide theme store to descendant components
provide('themeStore', themeStore);
</script>

<template>
  <n-config-provider :theme="themeStore.theme">
    <!-- Main content -->
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
    <n-global-style />
  </n-config-provider>
</template>

<style>
:root {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

code, pre, kbd, samp {
  font-family: 'Fira Code', monospace;
}

body {
  margin: 0;
  padding: 0;
}
</style>