<template>
  <n-card title="Payment Records">
    <div class="table-header">
      <n-space justify="space-between">
        <n-text v-if="selectedPayment" type="success">
          Selected: {{ selectedPayment.customer_name }} - {{ new Date(selectedPayment.payment_date).toLocaleDateString() }}
        </n-text>
        <n-text v-else type="warning">
          Select a payment to export as receipt
        </n-text>
        <n-button type="info" @click="exportToPDF" :disabled="!hasPayments || !selectedPayment">
          Export Receipt to PDF
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
      :row-props="rowProps"
    />

    <!-- Empty state message -->
    <div v-if="!isLoading && (!payments || payments.length === 0)" class="empty-state">
      <p>No payment records found. Add your first payment to get started.</p>
    </div>

    <!-- Edit Payment Modal -->
    <n-modal v-model:show="showEditModal" preset="card" :title="'Edit Payment'" style="width: 600px">
      <payment-form 
        :payment="selectedPaymentForEdit" 
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
import { NCard, NDataTable, NButton, NModal, NSpace, NAlert, useDialog, NText } from 'naive-ui';
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
const selectedPaymentForEdit = ref<Payment | undefined>(undefined);

// Dialog for confirmation
const dialog = useDialog();

// Row props for selection highlighting
const rowProps = (row: Payment) => {
  return {
    style: selectedPayment.value && selectedPayment.value.id === row.id 
      ? 'background-color: rgba(0, 128, 0, 0.1);' 
      : '',
    onClick: () => {
      selectedPayment.value = row;
    }
  };
};

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
                type: 'success',
                onClick: (e) => {
                  e.stopPropagation();
                  selectedPayment.value = row;
                }
              },
              { default: () => 'Select' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                onClick: (e) => {
                  e.stopPropagation();
                  handleEdit(row);
                }
              },
              { default: () => 'Edit' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                onClick: (e) => {
                  e.stopPropagation();
                  handleDelete(row);
                }
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
  selectedPaymentForEdit.value = { ...payment };
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
  selectedPaymentForEdit.value = undefined;
};

// Export to PDF function
const exportToPDF = async () => {
  try {
    // Get the selected payment for the receipt
    if (!selectedPayment.value) {
      // If no payment is selected, show error
      dialog.warning({
        title: 'No Payment Selected',
        content: 'Please select a payment to export as PDF',
      });
      return;
    }

    // Import libraries dynamically to avoid loading them unnecessarily
    const html2canvas = (await import('html2canvas-pro')).default;
    const { jsPDF } = await import('jspdf');
    const { save } = await import('@tauri-apps/plugin-dialog');
    const { writeFile } = await import('@tauri-apps/plugin-fs');

    // Show loading state
    isLoading.value = true;

    // Create a temporary div to render the receipt
    const receiptContainer = document.createElement('div');
    receiptContainer.style.position = 'absolute';
    receiptContainer.style.left = '-9999px';
    document.body.appendChild(receiptContainer);

    // Create a new Vue app instance for the receipt
    const { createApp } = await import('vue');
    const { default: PaymentReceipt } = await import('./PaymentReceipt.vue');
    
    // Create and mount the receipt component
    const receiptApp = createApp(PaymentReceipt, {
      payment: selectedPayment.value
    });
    
    const receiptInstance = receiptApp.mount(receiptContainer);
    
    // Wait a bit for the component to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create canvas from the receipt element
    const canvas = await html2canvas(receiptContainer.firstChild as HTMLElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#1a1a1f'
    });

    // Clean up the temporary elements
    receiptApp.unmount();
    document.body.removeChild(receiptContainer);

    // Calculate dimensions for A4 portrait
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add image of the receipt
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

    // Open save dialog
    const filePath = await save({
      filters: [{
        name: 'PDF',
        extensions: ['pdf']
      }],
      defaultPath: `payment_receipt_${selectedPayment.value.customer_name.replace(/\s+/g, '_')}.pdf`
    });

    if (filePath) {
      // Convert PDF to binary data
      const pdfData = pdf.output('arraybuffer');
      
      // Write to file
      await writeFile(filePath, new Uint8Array(pdfData));
      
      // Show success message
      dialog.success({
        title: 'Success',
        content: 'Payment receipt saved successfully!',
      });
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Show error message using Naive UI
    dialog.error({
      title: 'PDF Generation Error',
      content: 'Failed to generate PDF. Please try again.',
    });
  } finally {
    isLoading.value = false;
  }
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