<template>
  <div class="header">
    <div class="header-content">
      <div class="logo">
        <h1>NoteCash</h1>
      </div>
      <div class="nav">
        <n-menu
          v-model:value="activeKey"
          mode="horizontal"
          :options="menuOptions"
          @update:value="handleMenuUpdate"
        />
      </div>
      <div class="actions">
        <n-space>
          <ThemeToggle />
        </n-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  NMenu, 
  NSpace,
  NIcon,
  MenuOption
} from 'naive-ui';
import { 
  Add as AddIcon, 
  List as ListIcon
} from '@vicons/carbon';
import ThemeToggle from './ThemeToggle.vue';

// Get current route for active menu item
const route = useRoute();
const router = useRouter();
const activeKey = ref(route.path);

// Menu options
const menuOptions = computed<MenuOption[]>(() => [
  {
    label: 'View Payments',
    key: '/',
    icon: renderIcon(ListIcon)
  },
  {
    label: 'Add Payment',
    key: '/payments',
    icon: renderIcon(AddIcon)
  }
]);

// Helper function to render icons
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// Handle menu item click
const handleMenuUpdate = (key: string) => {
  router.push(key);
};
</script>

<style scoped>
.header {
  width: 100%;
  border-bottom: 1px solid #eee;
  padding: 0;
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 64px;
}

.logo {
  margin-right: 40px;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav {
  flex-grow: 1;
}

.actions {
  margin-left: 16px;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 