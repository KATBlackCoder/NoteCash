<template>
  <MainLayout>
    <div class="content-container">
      <n-space vertical size="large">
        <n-page-header title="Dashboard" />
        
        <!-- Display error if any -->
        <n-alert v-if="error" type="error" style="margin-bottom: 16px;">
          {{ error }}
          <div style="margin-top: 8px;">
            <n-button size="small" type="error" @click="retryFetch">
              Retry
            </n-button>
          </div>
        </n-alert>
        
        <!-- Summary Cards -->
        <SummaryCards :payments="payments" />
          
        <!-- All Payments Table -->
          <n-card title="Payment Records">
          <PaymentTable />
          </n-card>
        </n-space>
  </div>
  </MainLayout>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { NSpace, NPageHeader, NCard, NAlert, NButton } from 'naive-ui';
import MainLayout from '../layouts/MainLayout.vue';
import PaymentTable from '../components/payments/PaymentTable.vue';
import SummaryCards from '../components/dashboard/SummaryCards.vue';
import { usePaymentsStore } from '../stores/payments';

const router = useRouter();
const paymentsStore = usePaymentsStore();
const { payments, isLoading, error } = storeToRefs(paymentsStore);

// Load payments on component mount
onMounted(async () => {
  await fetchPayments();
});

// Fetch payments function that can be called for retry
const fetchPayments = async () => {
  try {
    await paymentsStore.fetchPayments();
  } catch (err) {
    console.error('Error in component while fetching payments:', err);
  }
};

// Retry function for when fetch fails
const retryFetch = async () => {
  // First try to reinitialize the database
  await paymentsStore.initializeDb();
  // Then fetch payments again
  await fetchPayments();
};
</script>

<style scoped>
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
</style> 