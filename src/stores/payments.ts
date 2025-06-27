import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import Database from '@tauri-apps/plugin-sql';
import { Payment } from '../types/payment';
import { format, parseISO } from 'date-fns';

export const usePaymentsStore = defineStore('payments', () => {
  // State
  const payments = ref<Payment[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const db = ref<any>(null);
  const isDbInitialized = ref(false);

  // Computed
  const formattedPayments = computed(() => {
    return payments.value.map(payment => ({
      ...payment,
      formattedDate: format(new Date(payment.payment_date), 'dd/MM/yyyy'),
      formattedAmount: payment.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' CFA'
    }));
  });

  // Actions
  async function initializeDb() {
    if (isDbInitialized.value) return; // Already initialized
    
    isLoading.value = true;
    error.value = null;
    
    try {
      console.log('Initializing database connection...');
      db.value = await Database.load('sqlite:notecash.db');
      console.log('Database connection established successfully');
      isDbInitialized.value = true;
      
      // Test the connection by running a simple query
      try {
        const testResult = await db.value.select('SELECT 1');
        console.log('Database test query successful:', testResult);
      } catch (testErr) {
        console.error('Database test query failed:', testErr);
        error.value = `Database connection test failed: ${testErr}`;
      }
    } catch (err) {
      error.value = `Failed to initialize database: ${err}`;
      console.error('Database initialization error:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPayments() {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (!isDbInitialized.value) {
        console.log('Database not initialized, initializing now...');
        await initializeDb();
      }
      
      if (!db.value) {
        throw new Error('Database connection not established');
      }
      
      console.log('Fetching payments from database...');
      const result = await db.value.select('SELECT * FROM payments ORDER BY payment_date DESC');
      console.log('Fetch result:', result);
      
      // Fix: Check the structure of the result object
      if (result && Array.isArray(result)) {
        // Direct array result
        payments.value = result;
      } else if (result && result.rows && Array.isArray(result.rows)) {
        // Result with rows property
        payments.value = result.rows;
      } else {
        console.error('Unexpected result structure:', result);
        payments.value = [];
      }
      
      console.log(`Retrieved ${payments.value.length} payments`, payments.value);
    } catch (err) {
      error.value = `Failed to fetch payments: ${err}`;
      console.error('Error fetching payments:', err);
      payments.value = []; // Ensure payments is always an array
    } finally {
      isLoading.value = false;
    }
  }

  async function addPayment(payment: Payment) {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (!isDbInitialized.value) {
        await initializeDb();
      }
      
      if (!db.value) {
        throw new Error('Database connection not established');
      }
      
      console.log('Adding payment:', payment);
      await db.value.execute(
        'INSERT INTO payments (customer_name, payment_date, amount, reason) VALUES (?, ?, ?, ?)',
        [payment.customer_name, payment.payment_date, payment.amount, payment.reason]
      );
      console.log('Payment added successfully');
      
      // Refresh the payments list
      await fetchPayments();
    } catch (err) {
      error.value = `Failed to add payment: ${err}`;
      console.error('Error adding payment:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePayment(payment: Payment) {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (!isDbInitialized.value) {
        await initializeDb();
      }
      
      if (!db.value) {
        throw new Error('Database connection not established');
      }
      
      await db.value.execute(
        'UPDATE payments SET customer_name = ?, payment_date = ?, amount = ?, reason = ? WHERE id = ?',
        [payment.customer_name, payment.payment_date, payment.amount, payment.reason, payment.id]
      );
      
      // Refresh the payments list
      await fetchPayments();
    } catch (err) {
      error.value = `Failed to update payment: ${err}`;
      console.error('Error updating payment:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function deletePayment(id: number) {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (!isDbInitialized.value) {
        await initializeDb();
      }
      
      if (!db.value) {
        throw new Error('Database connection not established');
      }
      
      await db.value.execute('DELETE FROM payments WHERE id = ?', [id]);
      
      // Refresh the payments list
      await fetchPayments();
    } catch (err) {
      error.value = `Failed to delete payment: ${err}`;
      console.error('Error deleting payment:', err);
    } finally {
      isLoading.value = false;
    }
  }

  // Initialize the database connection when the store is created
  // Use setTimeout to ensure the Tauri backend is ready
  setTimeout(() => {
    initializeDb().catch(err => {
      console.error('Failed to initialize database on store creation:', err);
    });
  }, 500);

  return {
    payments,
    formattedPayments,
    isLoading,
    error,
    fetchPayments,
    addPayment,
    updatePayment,
    deletePayment,
    initializeDb
  };
}); 