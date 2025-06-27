<template>
  <n-layout>
    <n-layout-header>
      <AppHeader />
    </n-layout-header>
    
    <n-layout-content>
      <slot></slot>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>
import { NLayout, NLayoutHeader, NLayoutContent } from 'naive-ui';
import AppHeader from '../components/layout/Header.vue';
</script>

<style scoped>
.n-layout-header {
  padding: 0;
  border-bottom: 1px solid #eee;
}

.n-layout-content {
  padding: 24px;
}
</style> 