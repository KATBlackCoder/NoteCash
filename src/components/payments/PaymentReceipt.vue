<template>
  <n-card class="receipt-container" title="Reçu de Paiement" :bordered="true">
    <n-space vertical size="small">
      <div class="info-row">
        <n-text class="info-label">Date</n-text>
        <n-text class="info-value">{{ formattedDate }}</n-text>
      </div>
      <div class="detail-row">
        <n-text class="detail-label">Montant</n-text>
        <n-text type="success" class="detail-value">{{ formatAmount(payment.amount) }} CFA</n-text>
      </div>

      <!-- Payment Information -->
      <div class="info-row">
        <n-text class="info-label">Bénéficiaire</n-text>
        <n-text class="info-value">{{ payment.customer_name }}</n-text>
      </div>
      
      <div class="info-row">
        <n-text class="info-label">Motif</n-text>
        <n-text class="info-value">{{ payment.reason }}</n-text>
      </div>
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { Payment } from "../../types/payment";
import { NCard, NText, NSpace, useThemeVars } from "naive-ui";
import { format } from "date-fns";

const props = defineProps<{
  payment: Payment;
}>();

// Get theme variables
const themeVars = useThemeVars();

// Format amount with thousands separator
const formatAmount = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// Format date using date-fns
const formattedDate = computed(() => {
  return format(new Date(props.payment.payment_date), "dd/MM/yyyy 'at' HH:mm");
});
</script>

<style scoped>
.receipt-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 0;
  font-family: v-bind('themeVars.fontFamily');
  border-radius: v-bind('themeVars.borderRadius');
  transition: all 0.3s v-bind('themeVars.cubicBezierEaseInOut');
  box-shadow: v-bind('themeVars.boxShadow1');
}

.detail-row,
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
}

.detail-row:last-child,
.info-row:last-child {
  border-bottom: none;
}

.detail-label,
.info-label {
  font-size: v-bind('themeVars.fontSize');
  color: v-bind('themeVars.textColor1');
}

.detail-value,
.info-value {
  font-size: v-bind('themeVars.fontSize');
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}
</style>
