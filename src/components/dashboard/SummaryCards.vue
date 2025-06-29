<template>
  <n-grid :cols="3" :x-gap="16" :y-gap="16">
    <n-grid-item>
      <n-card title="Total Payments" size="small">
        <n-statistic :value="totalPayments" />
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card title="Total Amount" size="small">
        <n-statistic :value="totalAmount" :precision="2">
          <template #suffix>
            CFA
          </template>
        </n-statistic>
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card title="Recent Activity" size="small">
        <n-statistic :value="recentCount" suffix="new payments this week" />
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NGrid, NGridItem, NCard, NStatistic } from 'naive-ui';
import { Payment } from '../../types/payment';
import { subDays, isAfter, parseISO } from 'date-fns';

// Define props
const props = defineProps<{
  payments: Payment[];
}>();

// Computed properties for dashboard stats
const totalPayments = computed(() => props.payments.length);

const totalAmount = computed(() => {
  return props.payments.reduce((sum, payment) => sum + payment.amount, 0);
});

// Get count of payments from the last 7 days using date-fns
const recentCount = computed(() => {
  const oneWeekAgo = subDays(new Date(), 7);
  
  return props.payments.filter(payment => {
    const paymentDate = new Date(payment.payment_date);
    return isAfter(paymentDate, oneWeekAgo);
  }).length;
});
</script> 