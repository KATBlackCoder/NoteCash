<template>
  <n-card title="Payment Records">
    <div class="table-header">
      <n-space justify="end">
        <n-button type="info" @click="exportToPDF" :disabled="!hasPayments">
          Export to PDF
        </n-button>
      </n-space>
    </div>
    
    <!-- Display error if any -->
    <n-alert v-if="error" type="error" style="margin-bottom: 16px;">
      {{ error }}
      <div style="margin-top: 8px;">
        <n-button size="small" type="error" @click="retryFetch">
          Retry
        </n-button>
      </div>
    </n-alert>
    
    <n-data-table
      :columns="columns"
      :data="payments"
      :loading="isLoading"
      :pagination="pagination"
      :bordered="false"
    />

    <!-- Empty state message -->
    <div v-if="!isLoading && (!payments || payments.length === 0)" class="empty-state">
      <p>No payment records found. Add your first payment to get started.</p>
    </div>

    <!-- Edit Payment Modal -->
    <n-modal v-model:show="showEditModal" preset="card" :title="'Edit Payment'" style="width: 600px">
      <payment-form 
        :payment="selectedPayment" 
        :is-modal="true"
        @payment-updated="handlePaymentUpdated" 
        @cancel="showEditModal = false" 
      />
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import { onMounted, computed, ref, h } from 'vue';
import { storeToRefs } from 'pinia';
import { usePaymentsStore } from '../../stores/payments';
import { NCard, NDataTable, NButton, NModal, NSpace, NAlert, useDialog } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { Payment } from '../../types/payment';
import PaymentForm from './PaymentForm.vue';

// Initialize store
const paymentsStore = usePaymentsStore();
const { payments, isLoading, error } = storeToRefs(paymentsStore);

// Computed property to check if there are any payments
const hasPayments = computed(() => payments.value && payments.value.length > 0);

// Modal state
const showEditModal = ref(false);
const selectedPayment = ref<Payment | undefined>(undefined);

// Dialog for confirmation
const dialog = useDialog();

// Table columns
const columns = computed<DataTableColumns<Payment>>(() => [
  {
    title: 'Customer Name',
    key: 'customer_name'
  },
  {
    title: 'Date',
    key: 'payment_date',
    render(row: Payment) {
      return new Date(row.payment_date).toLocaleDateString();
    }
  },
  {
    title: 'Amount',
    key: 'amount',
    render(row: Payment) {
      return `${row.amount.toFixed(2)} CFA`;
    }
  },
  {
    title: 'Reason',
    key: 'reason'
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row: Payment) {
      return h(
        NSpace,
        { justify: 'center', align: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                onClick: () => handleEdit(row)
              },
              { default: () => 'Edit' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                onClick: () => handleDelete(row)
              },
              { default: () => 'Delete' }
            )
          ]
        }
      );
    }
  }
]);

// Pagination
const pagination = {
  pageSize: 10
};

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

// Handle edit button click
const handleEdit = (payment: Payment) => {
  selectedPayment.value = { ...payment };
  showEditModal.value = true;
};

// Handle delete button click
const handleDelete = (payment: Payment) => {
  dialog.warning({
    title: 'Confirm Deletion',
    content: `Are you sure you want to delete the payment for ${payment.customer_name}?`,
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      await paymentsStore.deletePayment(payment.id!);
    }
  });
};

// Handle payment updated from form
const handlePaymentUpdated = () => {
  showEditModal.value = false;
  selectedPayment.value = undefined;
};

// Export to PDF function
const exportToPDF = () => {
  // This will be implemented in Phase 3
  alert('Export functionality will be available in a future update.');
};
</script>

<style scoped>
.table-header {
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: rgba(0, 0, 0, 0.45);
}
</style> 