<template>
  <n-card :title="isEditMode ? 'Edit Payment' : 'Add New Payment'">
    <n-form ref="formRef" :model="formModel" :rules="rules">
      <n-form-item label="Customer Name" path="customer_name">
        <n-input v-model:value="formModel.customer_name" placeholder="Enter customer name" />
      </n-form-item>
      
      <n-form-item label="Payment Date" path="payment_date">
        <n-date-picker v-model:value="formModel.payment_date" type="date" />
      </n-form-item>
      
      <n-form-item label="Amount" path="amount">
        <n-input-number v-model:value="formModel.amount" placeholder="Enter amount" />
      </n-form-item>
      
      <n-form-item label="Reason" path="reason">
        <n-input v-model:value="formModel.reason" placeholder="Enter payment reason" />
      </n-form-item>
      
      <n-space justify="end">
        <n-button @click="handleCancel">Cancel</n-button>
        <n-button type="primary" @click="handleSubmit" :loading="isSubmitting">
          {{ isEditMode ? 'Update Payment' : 'Add Payment' }}
        </n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { usePaymentsStore } from '../../stores/payments';
import { 
  NCard, 
  NForm, 
  NFormItem, 
  NInput, 
  NInputNumber, 
  NDatePicker, 
  NButton,
  NSpace
} from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import { Payment } from '../../types/payment';

// Define props
const props = defineProps<{
  payment?: Payment;
  isModal?: boolean;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'payment-added', payment: Payment): void;
  (e: 'payment-updated', payment: Payment): void;
  (e: 'cancel'): void;
}>();

// Computed properties
const isEditMode = computed(() => !!props.payment);

// Initialize store
const paymentsStore = usePaymentsStore();
const isSubmitting = ref(false);

// Form setup
const formRef = ref<FormInst | null>(null);
const formModel = ref({
  id: undefined as number | undefined,
  customer_name: '',
  payment_date: null as number | null,
  amount: 0,
  reason: ''
});

// Watch for payment prop changes to update form
watch(() => props.payment, (newPayment) => {
  if (newPayment) {
    formModel.value = {
      id: newPayment.id,
      customer_name: newPayment.customer_name,
      // Convert ISO date string to timestamp for date picker
      payment_date: newPayment.payment_date ? new Date(newPayment.payment_date).getTime() : null,
      amount: newPayment.amount,
      reason: newPayment.reason || ''
    };
  }
}, { immediate: true });

// Form validation rules
const rules: FormRules = {
  customer_name: {
    required: true,
    message: 'Please enter customer name',
    trigger: 'blur'
  },
  payment_date: [{
    required: true,
    message: 'Please select payment date',
    type: 'number',
    trigger: ['blur', 'change']
  }],
  amount: [{
    required: true,
    message: 'Please enter amount',
    type: 'number',
    trigger: ['blur', 'change']
  }, {
    validator: (rule, value) => {
      if (value === 0) {
        return new Error('Amount must be greater than 0');
      }
      return true;
    },
    trigger: ['blur', 'change']
  }]
};

// Handle form submission
const handleSubmit = () => {
  if (!formRef.value) return;
  
  console.log('Form values before validation:', {
    customer_name: formModel.value.customer_name,
    payment_date: formModel.value.payment_date,
    amount: formModel.value.amount,
    reason: formModel.value.reason
  });
  
  formRef.value.validate()
    .then(async () => {
      isSubmitting.value = true;
      try {
        // Convert date to string format
        const paymentDate = formModel.value.payment_date 
          ? new Date(formModel.value.payment_date).toISOString().split('T')[0]
          : '';
        
        const paymentData: Payment = {
          id: formModel.value.id,
          customer_name: formModel.value.customer_name,
          payment_date: paymentDate,
          amount: formModel.value.amount,
          reason: formModel.value.reason
        };
        
        if (isEditMode.value) {
          await paymentsStore.updatePayment(paymentData);
          emit('payment-updated', paymentData);
        } else {
          await paymentsStore.addPayment(paymentData);
          // Reset form after adding
          resetForm();
          emit('payment-added', paymentData);
        }

        // Close modal if in modal mode
        if (props.isModal) {
          emit('cancel');
        }
      } finally {
        isSubmitting.value = false;
      }
    })
    .catch((errors) => {
      // Validation failed, errors are displayed automatically by n-form
      console.error('Validation errors:', errors);
    });
};

// Reset form to initial state
const resetForm = () => {
  formModel.value = {
    id: undefined,
    customer_name: '',
    payment_date: null,
    amount: 0,
    reason: ''
  };
};

// Handle cancel button
const handleCancel = () => {
  emit('cancel');
};
</script> 