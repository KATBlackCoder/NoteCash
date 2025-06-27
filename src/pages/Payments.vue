<template>
  <MainLayout>
    <div class="content-container">
      <n-space vertical size="large">
        <n-page-header title="Add New Payment" />
        <!-- Success message -->
        <n-alert
          v-if="showSuccess"
          type="success"
          closable
          @close="showSuccess = false"
        >
          Payment added successfully!
          <n-button text type="primary" @click="goToDashboard"
            >View all payments</n-button
          >
        </n-alert>
        <!-- Add Payment Form -->
        <n-card>
          <PaymentForm @payment-added="handlePaymentAdded" />
        </n-card>
      </n-space>
    </div>
  </MainLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { NSpace, NPageHeader, NCard, NAlert, NButton } from "naive-ui";
import MainLayout from "../layouts/MainLayout.vue";
import PaymentForm from "../components/payments/PaymentForm.vue";
import { usePaymentsStore } from "../stores/payments";
import { Payment } from "../types/payment";

const router = useRouter();
const paymentsStore = usePaymentsStore();
const showSuccess = ref(false);

// Load payments store on component mount
onMounted(async () => {
  await paymentsStore.fetchPayments();
});

const handlePaymentAdded = (payment: Payment) => {
  // Show success message
  showSuccess.value = true;

  // Automatically hide after 5 seconds
  setTimeout(() => {
    showSuccess.value = false;
  }, 5000);
};

const goToDashboard = () => {
  router.push("/");
};
</script>

<style scoped>
.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}
</style>
